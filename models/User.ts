import { Schema, models, model } from "mongoose"

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    match: [/.+@.+\..+/, "Por favor, insira um email válido"],
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = models.User || model("User", UserSchema)

export default User
