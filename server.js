const mongoose = require("mongoose")
const Table = require("./Table")

mongoose.connect("mongodb://localhost/powerV3")

const io = require("socket.io")(3001, {
    cors: {
        origin: ["http://localhost:3000", "https://powerdatabase.onrender.com"],
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    console.log(`${socket.id} connected`)


    socket.on("createTable", async (name) => {
        console.log("creating table...")
        await createTable(name)
    })
    socket.on("seekTables", async (cb) => {
        let tables = await Table.find()
        cb(tables)
    })
    socket.on("joinTable", async (tableName, cb) => {
        let table = await findTableData(tableName)
        if (!table) return

        socket.join(tableName)
        console.log(`${socket.id} joined table ${tableName}`)
        cb(table)

        socket.on("register", async (tableName, color) => {
            await Table.findOneAndUpdate(
                { name: tableName, "players.color": color },
                { $set: { "players.$.socketId": socket.id }},
                { new: true }
            ).then((updatedTable) => {
                console.log(updatedTable.players)
                socket.to(tableName).emit("tableUpdated", updatedTable)
                console.log(`Joueur ${socket.id} registered as ${color}`)
            }).catch((err) => {
                console.error("Erreur lors de la mise à jour :", err);
            });
        })
        socket.on("saveData", async (pieces, logs) => {
            await Table.findOneAndUpdate({ name: tableName }, { pieces, logs })
        })
    })

    async function findTableData(tableName) {
        if (!tableName) return

        const table = await Table.findOne({ name: tableName }).exec()
        if (table) return table
        console.log("pas trouvé la table")
    }

    async function createTable(name) {
        console.log(name)
        const table = new Table({
            name: name,
            pieces: [
                {
                    color: "blue",
                    unite: "R",
                    case: "J0",
                },
                {
                    color: "red",
                    unite: "A",
                    case: "J4",
                },
                {
                    color: "red",
                    unite: "CR",
                    case: "S12",
                },
                {
                    color: "yellow",
                    unite: "C",
                    case: "VHQ",
                },
            ],
            creationDate: new Date(),
            logs: [
                {
                    color: "grey",
                    content: `Création de la table le ${new Date().toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })} à ${new Date().toLocaleTimeString("fr-FR", {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`
                }
            ],
            players: [
                {
                    name: "Marius",
                    color: "green",
                    socketId: "",
                    order: []
                },
                {
                    name: "Ulysse",
                    color: "blue",
                    socketId: "",
                    order: []
                },
            ]
        });

        try {
            const result = await table.save();
            console.log("Table créée avec succès :", result);
            return result;
        } catch (error) {
            console.error("Erreur lors de la création de la table :", error.message);
            throw error;
        }
    }
})
