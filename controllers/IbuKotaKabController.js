import IbuKota from "../models/IbuKotaKabModel.js";
import path from "path";
import fs from "fs";
import Kota from "../models/KotaModel.js";

export const getIbuKota = async (req, res) => {
  try {
    const kota = await Kota.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    const response = await IbuKota.findAll({
      where: {
        kota_id: kota.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getIbuKotaById = async (req, res) => {
  try {
    const response = await IbuKota.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveIbuKota = async (req, res) => {
  const kota = await Kota.findOne({
    where: {
      id: req.params.id,
    },
  });
  // if (req.files === null)
  //   return res.status(400).json({ msg: "No File Uploaded" });
  const kota_kabupaten = req.body.kota_kabupaten;
  const slug = req.body.slug;
  // const file = req.files.file;
  // const fileSize = file.data.length;
  const kota_id = kota.id;
  // const ext = path.extname(file.name);
  // const fileName = file.md5 + ext;
  // const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  // const allowedType = [".png", ".jpg", ".jpeg"];

  // if (!allowedType.includes(ext.toLowerCase()))
  //   return res.status(422).json({ msg: "Invalid Images" });
  // if (fileSize > 5000000)
  //   return res.status(422).json({ msg: "Image must be less than 5 MB" });

  // file.mv(`./public/images/${fileName}`, async (err) => {
    // if (err) return res.status(500).json({ msg: err.message });
    try {
      await IbuKota.create({
        kota_kabupaten: kota_kabupaten,
        slug: slug,
        // image: fileName,
        // url: url,
        kota_id: kota_id,
      });
      res.status(201).json({ msg: "IbuKota Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  // });
};

export const updateIbuKota = async (req, res) => {
  const ibukota = await IbuKota.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!ibukota) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = ibukota.image;
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

    const filepath = `./public/images/${ibukota.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await IbuKota.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "IbuKota Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteIbuKota = async (req, res) => {
  const ibukota = await IbuKota.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!ibukota) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${ibukota.image}`;
    fs.unlinkSync(filepath);
    await IbuKota.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "IbuKota Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
