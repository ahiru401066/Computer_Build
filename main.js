"use strict";
const config = {
    url: "https://api.recursionist.io/builder/computers",
    cpuBrand: document.getElementById("cpu-brand"),
    cpuModel: document.getElementById("cpu-model"),
    gpuBrand: document.getElementById("gpu-brand"),
    gpuModel: document.getElementById("gpu-model"),
    slotMany: document.getElementById("slot-many"),
    slotSize: document.getElementById("slot-size"),
    ramBrand: document.getElementById("ram-brand"),
    ramModel: document.getElementById("ram-model"),
    storageKind: document.getElementById("storage-kind"),
    storage: document.getElementById("storage"),
    storageBrand: document.getElementById("storage-brand"),
    storageModel: document.getElementById("storage-model"),
};

const btn = document.getElementById("btn");
btn.addEventListener("click", function(){
    Promise.all([
        fetchCPU(config.cpuBrand.value, config.cpuModel.value),
        fetchGPU(config.gpuBrand.value, config.gpuModel.value),
        fetchRam(config.slotMany.value, config.slotSize.value, config.ramBrand.value, config.ramModel.value),
        fetchStorage(config.storageKind.value, config.storage.value, config.storageBrand.value, config.storageModel.value),
    ]).then(([cpuScore,gpuScore,ramScore,storageScore]) => {
        const game = calcGame(cpuScore, gpuScore, ramScore, storageScore);
        const work = calcWork(cpuScore, gpuScore, ramScore, storageScore);
        outPut(game,work);
    });
});

function fetchCPU(brand, model){
    const cpuParam = "?type=cpu";
    let url = config.url + cpuParam;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = data.filter(item => 
                item.Brand.toLowerCase().includes(brand.toLowerCase()) &&
                item.Model.toLowerCase().includes(model.toLowerCase())
            );
            if (result.length === 0) return null;

            let score = result[0].Benchmark;
            return score;
        })
}

function fetchGPU(brand, model){
    const gpuParam = "?type=gpu";
    let url = config.url + gpuParam;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = data.filter(item => 
                item.Brand.toLowerCase().includes(brand.toLowerCase()) &&
                item.Model.toLowerCase().includes(model.toLowerCase())
            );
            if(result.length === 0) return null;
            return result[0].Benchmark;
        })
}

function fetchRam(many, size, brand, model){
    const ramParam = "?type=ram";
    let url = config.url + ramParam;
    let slot = many + "x" + size + "GB";

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = data.filter(item => 
                item.Brand.toLowerCase().includes(brand.toLowerCase()) &&
                item.Model.toLowerCase().includes(model.toLowerCase()) &&
                item.Model.toLowerCase().includes(slot.toLocaleLowerCase())
            )
            if(result.length === 0) return null
            return result[0].Benchmark;
        });

}

function fetchStorage(kind, storage, brand, model){
    const storageParam = kind.toLocaleLowerCase() == "hdd" ? "?type=hdd" : "?type=ssd";
    let url = config.url + storageParam;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = data.filter(item =>
                item.Brand.toLocaleLowerCase().includes(brand.toLocaleLowerCase()) &&
                item.Model.toLocaleLowerCase().includes(model.toLocaleLowerCase()) &&
                item.Model.toLocaleLowerCase().includes(storage.toLocaleLowerCase())
            )
            if(result.length === 0) return null
            return result[0].Benchmark;
        });
}

function calcGame(cpu,gpu,ram,storage){
    return gpu * 0.6 + cpu * 0.25 + ram * 0.125 + storage * 0.025;
}

function calcWork(cpu,gpu,ram,storage){
    return gpu * 0.6 + cpu * 0.25 + ram * 0.10 + storage * 0.05;
}

function outPut(game,work){
    let outPut = document.getElementById("output");
    outPut.innerHTML = `Gaming : ${game}%　　　Work : ${work}%`;
}