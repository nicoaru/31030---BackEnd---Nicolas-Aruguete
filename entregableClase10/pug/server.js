const express = require("express")
const Contenedor = require("./Contenedor");


// server y motor de plantilla
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("views", __dirname+"/views")
app.set("view engine", "pug")

const PORT = 8080
const server = app.listen(PORT, () => console.log(`Server escuchando en puerto ${server.address().port}`)).on("error", error => console.log(`Error conectando el servidor => ${error}`))

// instancia de Contenedor
const productos = new Contenedor("productos.txt")

// logica endpoints
app.get("/", (req, res) => {
    res.render("index")
})

app.post("/productos", (req, res, next) => {
    const obj = req.body
    productos.save(obj)
    .then(id => {
        res.redirect("/")
    })
    .catch(error => next(error))
})

app.get("/productos", (req, res, next) => {
    productos.getAll()
    .then(data => {
        const productos = data
        console.log("productos => ", productos)
        res.render("productos", {productos})
    })
    .catch(error => { 
        if(error.code === "ENOENT") { 
            const productos = []
            res.render("productos", {productos})}
        else {
            return next(error)
        }
    })
})