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
  let flag = allowedmood.includes(mood);
  if (!flag) {
    return res.status(400).json({ success: false, message: `Bad Input` });
  }
  const rows = await fetch_data(lat, lng, mood);
  if (rows) {
    return res.status(200).json({ success: true, message: rows });
  } else {
    return res
      .status(400)
      .json({ success: false, message: `Something wrong Happened` });
  }
}
export async function landingpage(req, res) {
  console.log("Hi from landing Page");
  return res.redirect("/home");
}
export async function renderlogin(req, res) {
  res.send("Rendered Login Page ");
}
export async function renderrigister(req, res) {
  res.send("Rendered Register ");
}
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error destroying session");
    }
    res.clearCookie("connect.sid");
    res.send("Logged out");
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
    return res.status(500).send(`Couldn't Enter the Data`);
  } else {
    req.session.userId = user.id;
    res.status(200).json({ success: true, message: "User Has Registered" });
  }
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await user_data(email);
  if (!user) {
    return res.redirect("/register");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: `Invalid Password` });
  }
  req.session.userId = user.id;
  return res.redirect("/home");
}
export async function home(req, res) {
  res.render("home");
}
