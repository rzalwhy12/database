import {Pool} from "pg"
import dotenv from "dotenv"

const pool = new Pool ({
    host : "aws-0-ap-southeast-1.pooler.supabase.com",
    port : 6543,
    database: "postgres",
    user : "postgres.jjdgdcseeoqlylxrgcgl",
    password : "Sayasatu23#"
})

export default pool;