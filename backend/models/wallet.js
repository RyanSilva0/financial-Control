import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    descricao: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    valor: {
      type: Number,
      required: true,
      min: 0,
    },

    tipo: {
      type: String,
      enum: ["entrada", "saida", "investimento"],
      required: true,
    },

    categoria: {
      type: String,
      required: true,
      trim: true,
    },

    data: {
      type: Date,
      default: Date.now,
    },
    parcela: {
      type: number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Wallet", walletSchema);
