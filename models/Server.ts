import { Schema, models, model } from "mongoose"

const ServerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Nome do servidor é obrigatório"],
    trim: true,
  },
  dockerContainerId: {
    type: String,
    unique: true,
    sparse: true, // Permite valores nulos, mas garante unicidade para não-nulos
  },
  status: {
    type: String,
    enum: ["creating", "running", "stopped", "error", "deleting"],
    default: "creating",
  },
  image: {
    type: String,
    required: [true, "Imagem Docker é obrigatória"],
    default: "ubuntu:latest", // Exemplo: pode ser configurável
  },
  ports: [
    {
      containerPort: { type: Number, required: true },
      hostPort: { type: Number, required: true },
    },
  ],
  allocatedCpu: {
    type: Number, // Ex: em milicores ou porcentagem
    default: 0.5, // Exemplo: 0.5 CPU core
  },
  allocatedMemory: {
    type: Number, // Ex: em MB
    default: 512, // Exemplo: 512 MB
  },
  fileSystemPath: {
    type: String, // Caminho no host para o volume persistente
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Server = models.Server || model("Server", ServerSchema)

export default Server
