import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
export async function fetch_data(lat, lng, mood) {
  const radius = 1000;
  const latt = parseFloat(lat);
  const long = parseFloat(lng);
  const latdelta = radius / 111000;
  const londelta = radius / (111000 * Math.cos((latt * Math.PI) / 180));
  const bbox = [
    long - londelta,
    latt - latdelta,
    long + londelta,
    latt + latdelta,
  ].join(",");
  const url = `https://photon.komoot.io/api/?q=${mood}&bbox=${bbox}&limit=7&lang=en`;
  try {
    const response = await fetch(url);
    const data = {
      name: "",
      country: "",
      city: "",
      district: "",
      locality: "",
      street: "",
    };
    let info = await response.json();
    if (!info.features || info.features.length === 0) {
      return null;
    }
    if (!info.features || info.features.length === 0) return null;
    let result = info.features.map((element) => ({
      name: element.properties.name,
      country: element.properties.country,
      city: element.properties.city,
      district: element.properties.district,
      locality: element.properties.locality,
      street: element.properties.street,
    }));
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function user_data(email) {
  const [rows] = await db.execute(`select*from User_info where email=?`, [
    email,
  ]);
  if (rows.length === 0) {
    return null;
  } else {
    return rows[0];
  }
}
export async function add_data(name, email, password) {
  const [rows] = await db.execute(
    `Insert into User_info(name,email,password)values(?,?,?)`,
    [name, email, password]
  );
  if (rows.affectedrows === 0) {
    return null;
  } else {
    return rows;
  }
}
