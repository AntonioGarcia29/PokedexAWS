const express = require('express');
const pokedex = express.Router();
const db = require('../config/database');
// GET
pokedex.get("/", async (req, res, next) => {
    const Poke_list = await db.query(`
        SELECT 
            p.pok_id, p.pok_name, p.pok_height, p.pok_weight, p.pok_base_experience, bs.b_hp,bs.b_atk,bs.b_def,bs.b_sp_atk,bs.b_sp_def,bs.b_speed,
            GROUP_CONCAT(t.type_name) AS pok_types 
        FROM 
            pokemon p 
        JOIN 
            pokemon_types pt ON p.pok_id = pt.pok_id 
        JOIN 
            types t ON pt.type_id = t.type_id 
        JOIN 
            base_stats bs ON p.pok_id = bs.pok_id 
        GROUP BY 
            p.pok_id, p.pok_name, p.pok_height, p.pok_weight, p.pok_base_experience, bs.b_hp, bs.b_atk, bs.b_def, bs.b_sp_atk, bs.b_sp_def, bs.b_speed;
    `);
    console.log(Poke_list);
    return res.status(200).json({ code: 1, message: Poke_list });
});

pokedex.get('/:id([0-9]{1,3})', async (req, res, next) => {
    const id = req.params.id;
    const { edit } = req.query; // Verifica si se está solicitando para edición

    if (id >= 1 && id <= 999) {
        try {
            let query = `
                SELECT 
                    p.pok_id, 
                    p.pok_name, 
                    p.pok_height, 
                    p.pok_weight, 
                    p.pok_base_experience,
                    bs.b_hp,
                    bs.b_atk,
                    bs.b_def,
                    bs.b_sp_atk,
                    bs.b_sp_def,
                    bs.b_speed,
                    GROUP_CONCAT(t.type_name) AS pok_types 
                FROM 
                    pokemon p 
                JOIN 
                    pokemon_types pt ON p.pok_id = pt.pok_id 
                JOIN 
                    types t ON pt.type_id = t.type_id 
                JOIN 
                    base_stats bs ON p.pok_id = bs.pok_id 
                WHERE 
                    p.pok_id = ? 
                GROUP BY 
                    p.pok_id, p.pok_name, p.pok_height, p.pok_weight, p.pok_base_experience, bs.b_hp, bs.b_atk, bs.b_def, bs.b_sp_atk, bs.b_sp_def, bs.b_speed;
            `;

            // Si se solicita para edición, incluye más información
            if (edit) {
                query += `
                    SELECT DISTINCT
                        t.type_name
                    FROM
                        types t
                    LEFT JOIN
                        pokemon_types pt ON t.type_id = pt.type_id
                    WHERE
                        pt.pok_id = ?;
                `;
            }

            const Poke_list = await db.query(query, [id, id]);

            if (edit) {
                return res.status(200).json({ code: 1, message: Poke_list[0], types: Poke_list[1] });
            } else {
                return res.status(200).json({ code: 1, message: Poke_list });
            }
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Error al buscar el Pokémon" });
        }
    }

    return res.status(404).send({ code: 404, message: "Pokemon no encontrado" });
});

pokedex.get('/:name([A-Za-z]+)', async (req, res, next) => {
    const name = req.params.name;
    if (name) {
        try {
            const Poke_list = await db.query(`
                SELECT 
                    p.pok_id, 
                    p.pok_name, 
                    p.pok_height, 
                    p.pok_weight, 
                    p.pok_base_experience,
                    bs.b_hp,
                    bs.b_atk,
                    bs.b_def,
                    bs.b_sp_atk,
                    bs.b_sp_def,
                    bs.b_speed,
                    GROUP_CONCAT(t.type_name) AS pok_types 
                FROM 
                    pokemon p 
                JOIN 
                    pokemon_types pt ON p.pok_id = pt.pok_id 
                JOIN 
                    types t ON pt.type_id = t.type_id 
                JOIN 
                    base_stats bs ON p.pok_id = bs.pok_id 
                WHERE 
                    p.pok_name LIKE ? 
                GROUP BY 
                    p.pok_id, p.pok_name, p.pok_height, p.pok_weight, p.pok_base_experience, bs.b_hp, bs.b_atk, bs.b_def, bs.b_sp_atk, bs.b_sp_def, bs.b_speed;
            `, [`%${name}%`]);
            return res.status(200).json({ code: 1, message: Poke_list });
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Error al buscar el Pokémon" });
        }
    }
    return res.status(404).send({ code: 404, message: "Pokemon no encontrado" });
});

//DELETE
pokedex.delete('/:id([0-9]{1,3})', async(req, res, next)=>{
    const query = `DELETE FROM pokemon WHERE pok_id=${req.params.id}`;
    const query2 = `DELETE FROM 'base_stats' WHERE pok_id =${req.params.id}`
    const query3 = `DELETE FROM 'pokemon_types WHERE pok_id =${req.params.id}'`

    const rows = await db.query(query);
    await db.query(query2);
    await db.query(query3);
    if(rows.affectedRows==1){
        return res.status(200).json({code:200, message: "Pokemon borrado correctamente"})
    }
    return res.status(404).send({code: 404, message: "Pokemon no encontrado"})
});


//post
pokedex.post('/', async (req, res, next) => {
    const { pok_id, pok_name, pok_height, pok_weight, pok_base_experience, b_hp, b_atk, b_def, b_sp_atk, b_sp_def, b_speed, pok_types } = req.body;

    try {
        // Insertar los datos en la base de datos
        await db.query(`
            INSERT INTO pokemon (pok_id, pok_name, pok_height, pok_weight, pok_base_experience)
            VALUES (?, ?, ?, ?, ?)
        `, [pok_id, pok_name, pok_height, pok_weight, pok_base_experience]);

        // Insertar los tipos del Pokémon en la tabla pokemon_types
        for (const type of pok_types) {
            await db.query(`
                INSERT INTO pokemon_types (pok_id, type_id)
                VALUES (?, ?)
            `, [pok_id, type]);
        }

        // Insertar las estadísticas base del Pokémon en la tabla base_stats
        await db.query(`
            INSERT INTO base_stats (pok_id, b_hp, b_atk, b_def, b_sp_atk, b_sp_def, b_speed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [pok_id, b_hp, b_atk, b_def, b_sp_atk, b_sp_def, b_speed]);

        return res.status(201).json({ code: 1, message: "Pokémon insertado correctamente" });
    } catch (error) {
        console.error("Error al insertar el Pokémon:", error);
        return res.status(500).json({ code: 500, message: "Error al insertar el Pokémon" });
    }
});

//patch

pokedex.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const {
        pok_name, 
        pok_height, 
        pok_weight, 
        pok_base_experience, 
        b_hp, 
        b_atk, 
        b_def, 
        b_sp_atk, 
        b_sp_def, 
        b_speed,
        pok_types
    } = req.body;

    try {
        await db.query(`
            UPDATE pokemon SET 
                pok_name = ?, 
                pok_height = ?, 
                pok_weight = ?, 
                pok_base_experience = ?
            WHERE pok_id = ?;
        `, [pok_name, pok_height, pok_weight, pok_base_experience, id]);

        await db.query(`
            UPDATE base_stats SET 
                b_hp = ?, 
                b_atk = ?, 
                b_def = ?, 
                b_sp_atk = ?, 
                b_sp_def = ?, 
                b_speed = ?
            WHERE pok_id = ?;
        `, [b_hp, b_atk, b_def, b_sp_atk, b_sp_def, b_speed, id]);

        await db.query(`DELETE FROM pokemon_types WHERE pok_id = ?;`, [id]);
 
        let slotCounter = 1; // Inicializamos el contador de slot

        for (const type of pok_types) {
            const typeIdResult = await db.query(`SELECT type_id FROM types WHERE type_name = ?`, [type]);
            if (typeIdResult.length > 0 && typeIdResult[0].type_id) {
                const typeId = typeIdResult[0].type_id;
                
                // Insertamos en la tabla pokemon_types con el valor actual de slotCounter
                await db.query(`INSERT INTO pokemon_types (pok_id, type_id, slot) VALUES (?, ?, ?);`, [id, typeId, slotCounter]);
                
                slotCounter++; // Incrementamos el contador para el siguiente tipo
            } else { 
                console.error(`No se encontró ningún type_id para el tipo: ${type}`);
                // Aquí puedes manejar el caso en el que no se encuentre el type_id, como lanzar un error o continuar sin insertar
            }
        }
        
        return res.status(200).json({ code: 1, message: 'Pokemon actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el Pokémon:', error);
        return res.status(500).send({ code: 500, message: 'Error al actualizar el Pokémon' });
    }
});





module.exports=pokedex; 