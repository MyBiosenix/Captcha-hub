const svgCaptcha = require("svg-captcha");
const Captcha = require("../models/CaptchaG");
const User = require("../models/User");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCustomCaptcha(text, difficultyLevel) {
  const fixedWidth = 250; 
  const height = 80;

  const gradientId = `grad${Math.floor(Math.random() * 10000)}`;
  let background = `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(${220+Math.random()*30},${220+Math.random()*30},${220+Math.random()*30});stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(${180+Math.random()*40},${180+Math.random()*40},${180+Math.random()*40});stop-opacity:1" />
      </linearGradient>
    </defs>
  `;

  let bgNoise = "";
  for (let i = 0; i < 20; i++) {
    bgNoise += `<circle 
                  cx="${randomInt(0, fixedWidth)}" 
                  cy="${randomInt(0, height)}" 
                  r="${randomInt(1, 2)}" 
                  fill="rgba(0,0,0,0.05)" />`;
  }
  
  let charSpacing = fixedWidth / (text.length + 1);

  let x = 20;
  let charsSvg = text.split("").map((ch) => {
    let dx = randomInt(-5, 5);
    let dy = randomInt(-10, 10);
    let rotate = randomInt(-20, 20);
    let skewX = randomInt(-10, 10);
    let fontSize = randomInt(28, 36);

    let thisX = x + dx - randomInt(0, 5); 
    let thisY = height / 2 + dy;

    let piece = `<text 
                  x="${thisX}" 
                  y="${thisY}" 
                  font-size="${fontSize}" 
                  fill="hsl(${Math.random() * 360},70%,30%)"
                  transform="rotate(${rotate},${thisX},${thisY}) skewX(${skewX})"
                  font-family="monospace"
                  dominant-baseline="middle"
                 >${ch}</text>`;

    x += charSpacing - randomInt(2, 6); 
    return piece;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" 
               width="${fixedWidth}" height="${height}">
            ${background}
            <rect width="100%" height="100%" fill="url(#${gradientId})"/>
            ${bgNoise}
            ${charsSvg}
          </svg>`;
}

exports.generateCaptcha = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "totalCaptcha captchaDifficulty captchaLength"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalCaptcha = user.totalCaptcha || 0;

    let baseLength = user.captchaLength || 5;  
    let baseDifficulty = user.captchaDifficulty || 1; 

    let captchaLength = Math.min(baseLength + Math.floor(totalCaptcha / 500), 12);

    let difficultyLevel;
    if (captchaLength < 12) {
      difficultyLevel = baseDifficulty;
    } else {
      let extra = Math.floor((totalCaptcha - (12 - baseLength) * 500) / 500);
      difficultyLevel = baseDifficulty + extra;
    }

    const charPresets = [
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789",
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%",
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?"
    ];

    let captcha = svgCaptcha.create({
      size: captchaLength,
      noise: 0,
      color: true,
      charPreset:
        difficultyLevel < 4
          ? charPresets[0]
          : difficultyLevel < 7
          ? charPresets[1]
          : charPresets[2],
    });

    captcha.data = generateCustomCaptcha(captcha.text, difficultyLevel);

    const newCaptcha = await Captcha.create({
      text: captcha.text,
      createdAt: new Date()
    });

    res.json({
      svg: captcha.data,
      id: newCaptcha._id,
      difficulty: difficultyLevel,
      length: captchaLength
    });
  } catch (error) {
    console.error("Error generating captcha:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.verifyCaptcha = async (req, res) => {
  try {
    const { captchaId, answer } = req.body;
    const userId = req.user.id;

    const captchaDoc = await Captcha.findById(captchaId);
    if (!captchaDoc) return res.status(410).json({ message: "Captcha expired" });

    const expirationTime = 2 * 60 * 1000;
    if (Date.now() - captchaDoc.createdAt.getTime() > expirationTime) {
      return res.status(410).json({ message: "Captcha expired" });
    }

    const isCorrect =
      String(answer || "").trim() === String(captchaDoc.text || "").trim();

    // 👇 populate the package field to get price
    const user = await User.findById(userId).populate("package", "price");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.totalCaptcha += 1;

    if (isCorrect) {
      user.rightCaptcha += 1;
      const packagePrice = user.package?.price || 0; // take price from package
      user.totalEarnings += packagePrice;
    } else {
      user.wrongCaptcha += 1;
    }

    await user.save();

    res.json({
      success: isCorrect,
      stats: {
        totalCaptcha: user.totalCaptcha,
        rightCaptcha: user.rightCaptcha,
        wrongCaptcha: user.wrongCaptcha,
        totalEarnings: user.totalEarnings,
      },
    });
  } catch (error) {
    console.error("Error verifying captcha:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getMyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("totalCaptcha rightCaptcha wrongCaptcha totalEarnings validTill package")
      .populate({
        path: "package",
        select: "packages"  // ✅ only fetch package name
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      totalCaptcha: user.totalCaptcha || 0,
      rightCaptcha: user.rightCaptcha || 0,
      wrongCaptcha: user.wrongCaptcha || 0,
      totalEarnings: user.totalEarnings || 0,
      validTill: user.validTill ? user.validTill.toISOString() : null,
      packageName: user.package?.packages || null   // ✅ only name, no price
    });
  } catch (e) {
    console.error("getMyStats error:", e.message);
    res.status(500).json({ message: "Server error" });
  }
};




exports.cleanupExpiredCaptchas = async () => {
  const expirationTime = 2 * 60 * 1000;
  const cutoff = new Date(Date.now() - expirationTime);
  await Captcha.deleteMany({ createdAt: { $lt: cutoff } });
};