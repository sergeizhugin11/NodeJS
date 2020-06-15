async function getRecordsByField(object, field, context) {
    const fields = {};
    fields[object + '_ID'] = field;
    
    let records = [];
    if (field) {
        records = await context.getOne(object, fields);
    } else {
        records = await context.getAll(object);
    }
    return records;
}
async function mutateRecord(object, idField, fields, context) {
    // If id specified then we can use only it to search the record, if it isn't then it doesn't matter
    return await context.getOne(object, idField ? idField : fields)
        .then(async records => {
            let targetRecord = {};
            // If the record exists
            if (records.length > 0) {
                // Then update it and return updated variant
                targetRecord = await context.updateOne(object, fields)
                    .then(() => context.getOne(object, fields));
            } else {
                // delete id field from fields object
                delete fields[Object.keys(fields).find(field => fields[field] === idField)];
                //delete fields.FACULTY_ID;
                // If there no, insert new one and return it
                targetRecord = await context.insertOne(object, fields)
                    .then(() => context.getOne(object, fields));
            }
            return targetRecord[0];
        });
}
async function deleteRecord(object, id, context) {
    let recordIDObject = {};
    recordIDObject[object + '_ID'] = id;
    let targetFACULTY = await context.getOne(object, recordIDObject);
    context.deleteOne(object, id);
    return targetFACULTY[0];
}


module.exports = {
    getFaculties: async (args, context) => {

	return await context.query(
                `SELECT FACULTY_ID, FACULTY_NAME FROM FACULTY;`
        ).then(result1 => {
	return context.query(
                `SELECT PULPIT_ID, PULPIT_NAME, FACULTY FROM PULPIT;`
        ).then(result2 => {


let obj = [];
		for(let i = 0; i< Array.from(result1).length; i++)
{
let obj1 = {FACULTY_ID: Array.from(result1)[i].FACULTY_ID, FACULTY_NAME: Array.from(result1)[i].FACULTY_NAME, PULPITS:[]}
		for(let j = 0; j < Array.from(result2).length; j++)
{
	if(Array.from(result1)[i].FACULTY_ID === Array.from(result2)[j].FACULTY)
{
	obj1.PULPITS.push({PULPIT_ID: Array.from(result2)[j].PULPIT_ID, PULPIT_NAME: Array.from(result2)[j].PULPIT_NAME})
}
}
obj.push(obj1);
}
console.log(obj);
return obj;
	});
	});
    },

    getPULPITs: (args, context) => getRecordsByField('PULPIT', args.PULPIT, context),
    getSUBJECTs: async (args, context) => {
	console.log(args);
        const {SUBJECT, FACULTY} = args;
        return FACULTY ?
            await context.query(
                `SELECT * FROM SUBJECT s
                    JOIN PULPIT p ON s.PULPIT = p.PULPIT_ID 
                    JOIN FACULTY f ON p.FACULTY = f.FACULTY_ID
                    WHERE p.FACULTY = ${FACULTY};`
            ) : await getRecordsByField('SUBJECT', SUBJECT, context);
    },
    getTEACHERs: async (args, context) => {
        const {TEACHER, FACULTY} = args;
        return FACULTY ?
            await context.query(
                `SELECT * FROM TEACHER t 
                    JOIN PULPIT p ON t.PULPIT = p.PULPIT_ID
                    JOIN FACULTY f ON p.FACULTY = f.FACULTY_ID
                    WHERE p.FACULTY = ${FACULTY};`
            ) : await getRecordsByField('TEACHER', TEACHER, context);
    },

    setFACULTY: (args, context) => {
        let fields = {FACULTY_ID: args.FACULTY.FACULTYID, FACULTY_NAME: args.FACULTY.FACULTYName};
        return mutateRecord('FACULTY', {FACULTY_ID: fields.FACULTY_ID}, fields, context);
    },
    setPULPIT: async (args, context) => {
        let fields = {PULPIT_ID: args.PULPIT.PULPITID, PULPIT_NAME: args.PULPIT.PULPITName, FACULTY: args.PULPIT.FACULTYID};
        return mutateRecord('PULPIT', fields.PULPIT_ID, fields, context);
    },
    setSUBJECT: async (args, context) => {
        let fields = {SUBJECT_ID: args.SUBJECT.SUBJECTID, SUBJECT_NAME: args.SUBJECT.SUBJECTName, PULPIT: args.SUBJECT.PULPITID};
        return mutateRecord('SUBJECT', fields.SUBJECT_ID, fields, context);
    },
    setTEACHER: async (args, context) => {
        let fields = {TEACHER_ID: args.TEACHER.TEACHERID, TEACHER_NAME: args.TEACHER.TEACHERName, PULPIT: args.TEACHER.PULPITID};
        return mutateRecord('TEACHER', fields.TEACHER_ID, fields, context);
    },

    delFACULTY: (args, context) => deleteRecord('FACULTY', args.ID, context),
    delPULPIT: (args, context) => deleteRecord('PULPIT', args.ID, context),
    delSUBJECT: (args, context) => deleteRecord('SUBJECT', args.ID, context),
    delTEACHER: (args, context) => deleteRecord('TEACHER', args.ID, context)
};