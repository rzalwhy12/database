import express , {Application} from "express";
import expenseRoutes from "./router/expenseRoutes"

const app : Application = express();
const port = 8003;

app.use(express.json());

app.use("/transaction", expenseRoutes);

app.get("/", (req ,res) => {
    res.send("Hello from express + typescript");
})

app.listen(port, () => {
    console.log(`server is running in ${port}`);
})