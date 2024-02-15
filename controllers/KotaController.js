import Kota from "../models/KotaModel.js";
import path from "path";
import fs from "fs";
// import Id from "../models/KotaModel.js"

export const getKota = async (req, res) => {
  try {
    const response = await Kota.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

//buat getkota byname
export const getKotaById = async (req, res) => {
  try {
    const response = await Kota.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveKota = (req, res) => {
  //tambahan karena relasi dengan id kota
  // let payload = req.body;

  // if (payload.id && payload.id.length > 0) {
  //   let id = Id.find({ name: { $in: payload.id } });
  //   if (id.length) {
  //     payload = { ...payload, id: id.map((kota) => kota._id) };
  //   } else {
  //     delete payload.id;
  //   }
  // }

  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const kota = req.body.kota;
  const slug = req.body.slug;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Kota.create({
        kota: kota,
        slug: slug,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Kota Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateKota = async (req, res) => {
  const kota = await Kota.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!kota) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = kota.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${kota.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.kota;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Kota.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Kota Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteKota = async (req, res) => {
  const kota = await Kota.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!kota) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${kota.image}`;
    fs.unlinkSync(filepath);
    await Kota.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kota Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
