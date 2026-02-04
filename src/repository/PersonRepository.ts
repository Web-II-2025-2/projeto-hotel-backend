import { Person } from "../models/Person";

export class PersonRepository {

    async findByEmail(email: string): Promise<Person | null> {
        return await Person.findOne({ where: { email } });
    }

    async findByUserId(userId: number): Promise<Person | null> {
        return await Person.findOne({ where: { userId } });
    }

    async createPerson(
        email: string,
        passwordHash: string,
        userId: number
    ): Promise<Person> {
        const person = await Person.create({
            email,
            passwordHash,
            userId
        });
        return person;
    }

    async getPerson(id: number): Promise<Person | null> {
        return await Person.findByPk(id);
    }

    async updatePerson(
        id: number,
        data: Partial<Person>
    ): Promise<Person | null> {
        const person = await Person.findByPk(id);
        if (!person) return null;

        await person.update(data);
        return person;
    }

    async getAllPersons(): Promise<Person[]> {
        return await Person.findAll();
    }

    async deletePerson(id: number): Promise<number> {
        return await Person.destroy({ where: { id } });
    }
}
