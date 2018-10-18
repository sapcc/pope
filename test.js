function fetch(s) {
    console.log("starting: ", s)
    return new Promise((rs, rj) => {
        setTimeout(() => {
            if (s === "3") {
                rj("FUCK")
            }
            rs(s);
        }, 1000)
    })
}

(async function() {
    ps =[]; 
    ["1", "2", "3", "4", "5"].forEach(i => {
        try {
            ps.push(fetch(i));
        } catch(err) {
            console.log("errs",err);
        }
    });

    for (p in ps) {
        try {
            logit(await ps[p])
        } catch(err) {
            console.log("err", err);
        }
    }
    //await Promise.all()
    console.log("DONE")
})();

async function logit (s) {
    console.log("LOG", s)
}