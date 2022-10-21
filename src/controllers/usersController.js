const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");
const { response } = require("express");

class usersController {

    async create(req, res){
        const {name, email, password} = req.body;

        const database = await sqliteConnection();

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(checkUserExists){
            throw new AppError("Este e-mail já esta em uso.")
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
        );

        return res.status(201).json()

    }

    async update(req, res){
        const { name, email, password, old_password } = req.body;
        const user_id = req.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if(!user){
            throw new AppError("Usuario não encontrado")
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Este Email já se encontra em uso.")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        // Alteração da senha.
        if(password && !old_password){
            throw new AppError("Informe a senha antiga para definir a nova senha.")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);
            if(!checkOldPassword){
                throw new AppError("Senha antiga incorreta.")
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`, [user.name, user.email, user.password, user_id]
            )

            return res.status(200).json();

    }

};

module.exports = usersController;