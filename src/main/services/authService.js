import {generateToken, setTokenCookie} from "../utils/jwt/JwtService.js";
import {comparePassword} from "../utils/bcrypt/BCryptService.js";
import {User} from "../models/init.js";

class AuthService {
  static async login(req, res) {
    const {email, password}=req.body;
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'role', 'full_name']
    });

    if (!user) {
      return res.status(401).json({success: false, details: [{message: "Invalid email or password"}]});
    }
    if (!await comparePassword(password, user.password)) {
      return res.status(401).json({success: false, details: [{message: "Invalid email or password"}]});
    }

    user.last_login = Date.now();
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({success: true,role: user.role, token: token});
  }
}
export default AuthService;

