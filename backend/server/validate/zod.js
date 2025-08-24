

const { z } = require("zod");


function checkInputsforSignup(data) {

    // defining structure,
    const structure = z.object({
        firstname: z.string()
            .min(5, "Must have atleast 5 characters")
            .max(80),
        lastname: z.string()
            .min(5, "Must have atleast 5 characters")
            .max(80),
        email: z.string().email("Email is invalid")
            .min(5, "Must have atleast 5 characters")
            .max(80)
            .transform((val) => val.toLowerCase()),
        username: z.string()
            .min(5, "Must have atleast 5 characters")
            .max(80)
            .transform((val) => val.toLowerCase()),
        password: z.string()
            .min(5, "Must have atleast 5 characters")
            .max(100)
            .refine((val) => /[A-Z]/.test(val), { message: "Password must contain atleast one uppercase character" })

            .refine((val) => /[a-z]/.test(val), { message: "Password must contain atleast one lowercase character" })

            .refine((val) => /[@$!%*?&]/.test(val), {
                message: "Password must contain atleast one special character (@$!%*?&)"
            })
    });


    //checking the input data
    const zodResponse = structure.safeParse(data);
    return zodResponse; //return reposnse either success or error

}

function checkInputsforSignin(data) {

    // defining structure,
    const structure = z.object({
        email: z.string().email("Email is invalid")
            .min(5, "Email must contain atleast 5 characters")
            .max(80)
            .transform((val) => val.toLowerCase()),

        password: z.string()
            .max(100, "Please decrease the password length")
    });

    //checking the input data
    const zodResponse = structure.safeParse(data);
    return zodResponse; //return reposnse either success or error

}


function checkInputs_ToAddTodo(data) {
    const structure = z.object({
        title: z.string()
            .min(4, "Tilte should be least length of 4 characters")
            .max(180, "Please decrease the length of title"),
    });

    return structure.safeParse(data);
}

module.exports = { checkInputsforSignup, checkInputsforSignin, checkInputs_ToAddTodo };