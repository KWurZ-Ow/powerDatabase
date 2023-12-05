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
    socket.on("joinTable", (tableId) => {
        let pieces = [
            {
                color: "blue",
                type: "R",
                case: "J0",
            },
            {
                color: "red",
                type: "A",
                case: "J4",
            },
            {
                color: "red",
                type: "CR",
                case: "S12",
            },
            {
                color: "yellow",
                type: "C",
                case: "VHQ",
            },
        ]

        socket.join(tableId)
        socket.emit("loadPieces", pieces)
        
        socket.on("piecesChanged", (pieces) => {
            console.log(`nouvelles pieces ! ${pieces.length}`)
            socket.broadcast.to(tableId).emit("updatePieces", pieces)
        })
    })

    async function findTableData(tableId) {
        if (!tableId) return

        const table = await Table.findById(tableId)
        if (table) return table
        throw new Error("pas trouvé la table")
    }
    
    //mobile
    socket.on("register", (color) => {
        console.log(`Joueur ${socket.id} registered as ${color}`)
    })
})
