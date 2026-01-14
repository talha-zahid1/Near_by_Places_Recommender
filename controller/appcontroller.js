import { fetch_data, user_data, add_data } from "../model/appmodel.js";
import bcrypt from "bcrypt";
export async function getdata(req, res) {
  const { lat, lng, mood } = req.query;
  const allowedmood = [
    "coffee",
    "work",
    "fitness",
    "food",
    "pub",
    "park",
    "library",
  ];
  const cleanmode=mood?mood.trim().toLowerCase():"";
  let flag = allowedmood.includes(cleanmode);
  if (!flag) {
    return res.status(400).json({ success: false, message: `Bad Input` });
  }
  const rows = await fetch_data(lat, lng, cleanmode);
  if (rows) {
    return res.status(200).json({ success: true, message: rows });
  } else {
    return res
      .status(400)
      .json({ success: false, message: `Something wrong Happened` });
  }
}
export async function checkpoint(req,res) {

    if (req.session.userId &&req.session) {
        return res.status(200).json({success:true,isLoggedIn:true,user: { name: "User", email: "" }});
    }
    return res.status(401).json({success:false,isLoggedIn:false});
}
export async function home(req, res) {
  res.status(200).json({success:true,message:'Ready to render'});
}
export async function landingpage(req, res) {
  return res.status(200).json({success:true,message:"Render landing page"});
}
export async function renderlogin(req, res) {
  res.status(200).json({success:true,message:"Rendered Login Page "});
}
export async function renderrigister(req, res) {
  res.json({success:true,message:"Rendered Register "});
}
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error destroying session");
    }
    res.clearCookie("connect.sid");
    res.status(200).json({success:true,message:"Logged out"});
  });
}
export async function register(req, res) {
  const { name, email, password } = req.body;
  const hashpass = await bcrypt.hash(password, 10);
  let rows = "";
  if (hashpass) {
    rows = await add_data(name, email, hashpass);
  }
  const user = await user_data(email);
  if (rows === null) {
    return res.status(500).json({success:false,message:`Couldn't Enter the Data`});
  } else {
    req.session.userId = user.id;
    res.status(200).json({ success: true,user: { name: user.name, email: user.email },redirectTo:'/home'});
  }
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await user_data(email);
  if (!user) {
    return res.status(404).json({success:false,message:'User Not FOund Please Register'});
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: `Invalid Password` });
  }
  req.session.userId = user.id;
  return res.status(200).json({success:true,user: { name: user.name, email: user.email },redirectTo:'/home'});
}

