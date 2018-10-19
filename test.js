const { PerformanceObserver, performance } = require('perf_hooks');
const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].duration);
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });


function fetch(s, timeout) {
    console.log("starting: ", s)
    return new Promise((rs, rj) => {
        setTimeout(() => {
            if (s === "3") {
                rj("DOH")
            }
            rs(s);
        }, timeout)
    })
}

async function callParallelAsync() {
    await fetch("hihihih", 500)
    return [fetch("blab", 5000), fetch("3", 6000), fetch("blob", 4000)];
}

(async function() {
    performance.mark('A');
    let result = await callParallelAsync();
    try {
        for (let r in result) {
            console.log(": )")
            await result[r];
        }
    } catch(err) {
        console.log("ERR", err)
    }
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
})();

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
})

async function logit (s) {
    console.log("LOG", s)
}