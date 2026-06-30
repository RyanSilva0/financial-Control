import express from "express";
import wallet from "../models/wallet.js";

const router = express.Router();
//CREATE
router.post("/", async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria, data, parcela } = req.body;

    const user = await wallet.create({
      descricao,
      valor,
      tipo,
      categoria,
      data,
      parcela,
    });

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//READ
router.get("/", async (req, res) => {
  try {
    const wallet = await wallet.find();

    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const newwallet = await wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!newwallet) {
      return res.status(404).json({
        message: "carteira não encontrada",
      });
    }

    res.status(200).json({
      message: "carteira atualizada com sucesso",
      user: newwallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletewallet = await wallet.findByIdAndDelete(req.params.id);

    if (!deletewallet) {
      return res.status(404).json({
        message: "carteira não encontrada",
      });
    }

    res.status(200).json({
      message: "carteira deletada com sucesso",
      user: deletewallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
