import SliderHeaderSnbt from "../../../models/Program/BimbelSnbt/SliderHeaderSnbtModel.js";
import path from "path";
import fs from "fs";

export const getSliderHeaderSnbt = async (req, res) => {
  try {
    const response = await SliderHeaderSnbt.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getSliderHeaderSnbtById = async (req, res) => {
  try {
    const response = await SliderHeaderSnbt.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveSliderHeaderSnbt = (req, res) => {
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
      await SliderHeaderSnbt.create({
        name: name,
        slug: slug,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "SliderHeaderSnbt Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateSliderHeaderSnbt = async (req, res) => {
  const sliderHeaderSnbt = await SliderHeaderSnbt.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!sliderHeaderSnbt) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = sliderHeaderSnbt.image;
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

    const filepath = `./public/images/${sliderHeaderSnbt.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await SliderHeaderSnbt.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "SliderHeaderSnbt Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSliderHeaderSnbt = async (req, res) => {
  const sliderHeaderSnbt = await SliderHeaderSnbt.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!sliderHeaderSnbt) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${sliderHeaderSnbt.image}`;
    fs.unlinkSync(filepath);
    await SliderHeaderSnbt.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "SliderHeaderSnbt Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
