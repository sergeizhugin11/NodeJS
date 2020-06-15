const fs = require('fs');

let phones  = [];

module.exports = {
    getPhones: () => function() {return phones;},

    getPhoneById: function(id) { return phones.find(phone => phone.id === Number(id));},

    addPhone(fields) 
    {
        const {fullName, phone} = fields;
        if (!fullName || !phone) throw new Error('Input all fields');
        let iddd = phones.length == 0 ? 1 : phones[phones.length - 1].id + 1;
        const newPhone = {
            id: iddd,
            fullName,
            phone
        };
        phones.push(newPhone);
        fs.writeFile(__dirname + "./../phones.json", JSON.stringify(phones , null, '  '), err => { if (err) throw err;});
        return newPhone;
    },

    updatePhone(fields) 
    {
        const {id, fullName, phone} = fields;
        if (!id || !fullName || !phone) throw new Error('Empty id, fullName or phone fields');
        let targetPhone = phones.find(phone => phone.id === Number(id));
        if (!targetPhone) throw new Error('Input true Id');
        targetPhone.fullName = fullName;
        targetPhone.phone = phone;
        fs.writeFile(__dirname + "./../phones.json", JSON.stringify(phones , null, '  '), err => { if (err) throw err; });
        return targetPhone;
    },

    deletePhone(id) 
    {
        let targetPhone = phones.find(phone => Number(phone.id) === Number(id));
		console.log(targetPhone);
        if (!targetPhone) throw new Error('Input true Id');
        phones  = phones .filter(phone => phone.id !== Number(id));
        fs.writeFile(__dirname + "./../phones.json", JSON.stringify(phones , null, '  '), err => { if (err) throw err; });
        return targetPhone;
    }
};

