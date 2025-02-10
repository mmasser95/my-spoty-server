import User from "#models/user";
import hash from "@adonisjs/core/services/hash";

export default class LoginRepository {
    public async login(email: string, password: string) {
        const user = await User.findBy('email', email)
        if (!user) throw new Error("El usuario no existe")


        const passwordValid = await hash.verify(user.password, password)
        console.log(passwordValid);
        if (!passwordValid) throw new Error("Contraseña incorrecta")

        const token = await User.accessTokens.create(user)
        return { ...user, token }
    }
}