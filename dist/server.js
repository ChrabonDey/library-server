"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library').then(() => {
    console.log("Mongodb Connected");
    console.log(process.env.MONGO_URI);
    app_1.default.listen(port, () => console.log(`Server is Running ${port}`));
})
    .catch((err) => console.error("Mongodb connection error", err));
