// import Mapel from "../models/MapelModel.js";

// export const getMapel = async (req, res) => {
//   try {
//     const response = await Mapel.findAll();
//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const getMapelById = async (req, res) => {
//   try {
//     const response = await Mapel.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const createMapel = async (req, res) => {
//   try {
//     await Mapel.create(req.body);
//     res.status(201).json({ msg: "Mapel Created" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const updateMapel = async (req, res) => {
//   try {
//     await Mapel.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json({ msg: "Mapel Updated" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const deleteMapel = async (req, res) => {
//   try {
//     await Mapel.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json({ msg: "Mapel Deleted" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };


import Mapel from "../models/MapelModel.js";
import path from "path";
import fs from "fs";

export const getMapel = async (req, res) => {
  try {
    const response = await Mapel.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMapelById = async (req, res) => {
  try {
    const response = await Mapel.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveMapel = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const name = req.body?.title;
  const slug = req.body?.slug;
  const file = req.files?.file;
  const fileSize = file?.data?.length;
  const ext = path.extname(file?.name);
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
      await Mapel.create({
        name: name,
        slug: slug,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Mapel Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateMapel = async (req, res) => {
  const mapel = await Mapel.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!mapel) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = mapel.image;
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

    const filepath = `./public/images/${mapel.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Mapel.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Mapel Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMapel = async (req, res) => {
  const mapel = await Mapel.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!mapel) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${mapel.image}`;
    fs.unlinkSync(filepath);
    await Mapel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Mapel Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
