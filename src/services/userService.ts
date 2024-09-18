import db from "../dbConfig";

interface Filter {
    queryObj: any;
    skip: number;
}

const FilterUserService = async (
    data: Filter
): Promise<{
    message: string;
    data: any;
}> => {
    const { queryObj, skip } = data;
    const query = `SELECT * FROM User ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "startDay") {
                return `birth >= "${queryObj[key]}-01-01"`;
            } else if (key === "endDay") {
                return `birth <= "${queryObj[key]}-12-31"`;
            } else if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "gender") {
                return queryObj[key] === "male" ? `gender = 0` : `gender = 1`;
            } else if (queryObj[key] !== "") {
                return `(phoneNumber like '%${queryObj[key]}%' or name like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" and ")} LIMIT 10 OFFSET ${skip}`;
    return new Promise(async (resolve, reject) => {
        db.query(query, function (err: any, data: any) {
            if (err) throw err;
            resolve({
                message: "Get users by params successfully",
                data,
            });
        });
    });
};
