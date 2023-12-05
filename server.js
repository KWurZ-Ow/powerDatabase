const mongoose = require("mongoose")
const Table = require("./Table")

mongoose.connect("mongodb://localhost/powerV3")

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    console.log(`${socket.id} connected`)

    //table
    socket.on("createTable", async (name) => {
        console.log("creating table...")
        await createTable(name)
    })
    socket.on("joinTable", async (tableName) => {
        socket.join(tableName)

        let table = await findTableData(tableName)
        if (!table) return
        socket.emit("loadPieces", table.pieces, table.logs)

        socket.on("saveData", async (pieces, logs) => {
            console.log(`pieces saved`)
            await Table.findOneAndUpdate({ name: tableName }, { pieces, logs })
            console.log("updated");
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
            orders: [
                {
                    color: "green",
                    order: []
                },
                {
                    color: "blue",
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

    //mobile
    socket.on("register", (color) => {
        console.log(`Joueur ${socket.id} registered as ${color}`)
    })
})
