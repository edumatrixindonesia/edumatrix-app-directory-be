import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const User = db.define('gurus',{
    name: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    topTitle: DataTypes.STRING,
    universitas : DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
},{
    freezeTableName:true
});

export default User;

(async()=>{
    await db.sync();
})();