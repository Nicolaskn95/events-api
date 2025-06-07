import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const createUser = async (req, res) => {
  try {
    req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.name.replace(
      / /g,
      "+"
    )}&background=random`;

    // bcrypt para criptografar a senha
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const db = req.app.locals.db;
    const result = await db.collection("users").insertOne(req.body);

    if (result.insertedId) {
      return res
        .status(201)
        .json({ success: true, message: "Usuário criado com sucesso" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Falha ao criar usuário" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = req.app.locals.db;
    let user = await db.collection("users").find({ email }).limit(1).toArray();

    if (!user.length) {
      return res.status(400).json({
        error: [
          {
            value: `${email}`,
            msg: `Email: ${email} não está cadastrado`,
            param: "email",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({
        error: [
          {
            value: `${email}`,
            msg: `A senha informada está incorreta`,
            param: "password",
          },
        ],
      });
    }

    jwt.sign(
      { user: { id: user[0]._id, avatar: user[0].avatar } },
      process.env.SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token,
        });
      }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const db = req.app.locals.db;
  const token = req.header("access_token");
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await db
    .collection("users")
    .findOne({ _id: ObjectId.createFromHexString(decoded.user.id) });

  res.status(200).json({ user });
};

export const updateUser = async (req, res) => {
  const db = req.app.locals.db;
  const token = req.header("access_token");
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      error: "Nenhum dado foi enviado para atualização",
    });
  }

  try {
    const userId = ObjectId.createFromHexString(decoded.user.id);
    const updateData = { ...body, updatedAt: new Date() };
    if (body.name) {
      updateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        body.name
      )}&background=random`;
    }

    delete updateData._id;

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const updatedUser = result;
    delete updatedUser.password; // Remove sensitive information

    res.json({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar o usuário",
      details: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const db = req.app.locals.db;
  const token = req.header("access_token");
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await db
    .collection("users")
    .findOne({ _id: ObjectId.createFromHexString(decoded.user.id) });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Usuário não encontrado",
    });
  }

  try {
    await db
      .collection("users")
      .deleteOne({ _id: ObjectId.createFromHexString(decoded.user.id) });
    res.json({
      success: true,
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Erro ao deletar o usuário",
      details: error.message,
    });
  }
};
