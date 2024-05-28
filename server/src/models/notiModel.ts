import { Schema, model } from "mongoose";

import { INoti } from "@src/dtos/chatDto";

const notiSchema = new Schema<INoti>(
    {
      _id: { type: String, required: true, unique: true },
      isTop: { type: Boolean, default: false },
      contents: { type: String, required: true },
      createdDate: { type: Date, default: Date.now },
      updatedDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
  );
  
  export default notiSchema;