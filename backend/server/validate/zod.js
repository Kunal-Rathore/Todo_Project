

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
        email: z.email("Email is invalid")
            .min(5, "Must have atleast 5 characters")
            .max(80)
            .toLowerCase(),
        username: z.string()
            .min(5, "Must have atleast 5 characters")
            .max(80)
            .toLowerCase(),
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
        email: z.email("Email is invalid")
            .min(5, "Email must contain atleast 5 characters")
            .max(80)
            .toLowerCase(),

        password: z.string("Password should be a string")
            .max(100)
    });

    //checking the input data
    const zodResponse = structure.safeParse(data);
    return zodResponse; //return reposnse either success or error

}


module.exports = { checkInputsforSignup, checkInputsforSignin };