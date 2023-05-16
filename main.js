/* You start out with negative money to reference how often farmers start in debt*/
let money_in_dollars = -50000.00;
const field = [];
let costs = {
    Cauliflower: 2.40,
    Melon: 2.40,
    Pumpkin: 2.40
}
let prices = {
    Cauliflower: 6.00,
    Melon: 6.00,
    Pumpkin: 6.00
}
const growth_rates = {
    Cauliflower: 1.00,
    Melon: 1.00,
    Pumpkin: 1.00
}
displaying_progress = "empty";

/* global function here because this will be used in several places in the code*/
const update_info = function(key){
    const info_text = document.getElementById("text_area");
    if (key == 'Default'){
        if (money_in_dollars >= 0){
            info_text.innerText = `Welcome to CropVille! You currently have ${(money_in_dollars).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}.`+ 
        ` Drag and drop seeds to plant them, mouseover the seeds to check their data for the day, it changes with the weather. Mouseover plants to show their progress below.`
        }else {
            info_text.innerText = `Welcome to CropVille! You are currently ${(-1 * money_in_dollars).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} in debt.`+ 
        ` Drag and drop seeds to plant them, mouseover the seeds to check their data for the day, it changes with the weather. Mouseover plants to show their progress below.`
        }
    } else if (key == "Melon"){
        info_text.innerText = `Cost: ${costs.Melon.toLocaleString('en-US', {style: 'currency', currency: 'USD'})},  Sale Price: ${prices['Melon'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})},` + 
    `   Growth Rate: ${growth_rates['Melon']}.`
    } else if (key == "Cauliflower"){
        info_text.innerText = `Cost: ${costs['Cauliflower'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})},  Sale Price: ${prices['Cauliflower'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})},` + 
    `   Growth Rate: ${growth_rates['Cauliflower']}.`
    } else if (key == "Pumpkin"){
        info_text.innerText = `Cost: ${costs['Pumpkin'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})},  Sale Price: ${prices['Pumpkin'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})},` + 
    `   Growth Rate: ${growth_rates['Pumpkin']}.`
    } else if (key == "Hoe"){
        info_text.innerText = "Use this to dig up crops."
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    update_info('Default')
})


class farm_plot {
    constructor(element){
        this.plot_div = element;
        this.plant = "empty";
        this.plant_img = "empty";
        this.growth_times = 0;
        

        this.plot_div.addEventListener("mouseout",(event) => {
            let progress_back = document.getElementsByClassName("progress")[0]
            let progress_bar = document.getElementsByClassName("progress-bar")[0]
            progress_back.style.visibility = "hidden";
            progress_bar.style.visibility = "hidden";
            progress_bar.style.width = "0%"
            progress_bar.setAttribute("aria-valuenow", "0")
            displaying_progress = "empty";
        });
        this.plot_div.addEventListener("mousemove",(event) => {
            if (this.plant != "empty"){
                let progress_back = document.getElementsByClassName("progress")[0]
                let progress_bar = document.getElementsByClassName("progress-bar")[0]
                let progress = Math.round(20 * (this.growth_times - 1))
                progress_back.style.visibility = "visible";
                progress_bar.style.width = `${progress}%`
                progress_bar.setAttribute("aria-valuenow", `${progress}`)
                progress_bar.style.visibility = "visible"
                displaying_progress = this;
            }
        });
        this.plot_div.addEventListener("dragover", (event) => {
            allowDrop(event)
            this.plot_div.style.border = "1px solid green";
        });
        this.plot_div.addEventListener("dragleave", function(event){
            event.target.style.border = "none";
        });
        this.plot_div.addEventListener("drop", (event) => {
            this.plot_div.style.border = "none" 
            let data = event.dataTransfer.getData("text");
            if (data == "Hoe") {
                this.plant = "empty"
                if (this.plant_img != "empty"){
                    this.plot_div.removeChild(this.plant_img)
                }
                this.plant_img = "empty"
                this.growth_times = 0;
            } else if (this.plant == "empty"){
                this.plant = data;
                money_in_dollars -= costs[data];
                update_info('Default')
                let img = document.createElement('img');
                img.src = `images/${this.plant}_Stage_1.webp`
                img.style.width = "80%" ;
                img.style.height = "80%";
                img.draggable = false;
                this.plot_div.appendChild(img)
                this.plant_img = img;
                this.growth_times = 1;
                grow(this);
            }

        });
    }
}
/* global because there was difficulty with javascript making this a method*/
async function grow(plot) {
    grow_time = 0
    if (plot.growth_times < 6){
        await new Promise((resolve) => setTimeout(resolve, 10000 / growth_rates[plot.plant]));
        plot.growth_times += 1;
        plot.plant_img.src = `images/${plot.plant}_Stage_${plot.growth_times}.webp`;
        if (plot == displaying_progress){
            let progress_back = document.getElementsByClassName("progress")[0]
            let progress_bar = document.getElementsByClassName("progress-bar")[0]
            let progress = Math.round(20 *(plot.growth_times - 1))
            progress_back.style.visibility = "visible";
            progress_bar.style.width = `${progress}%`
            progress_bar.setAttribute("aria-valuenow", `${progress}`)
            progress_bar.style.visibility = "visible"
            displaying_progress = plot;
        }
        grow(plot);
    } else if (plot.plant != "empty"){
        plot.plant_img.addEventListener("click", () => {
            money_in_dollars += prices[plot.plant];
            update_info('Default');
            plot.plant = "empty"
            if (plot.plant_img != "empty"){
                plot.plot_div.removeChild(plot.plant_img)
            }
            plot.growth_times = 0;
            plot.plant_img = "empty"
            let progress_back = document.getElementsByClassName("progress")[0]
            let progress_bar = document.getElementsByClassName("progress-bar")[0]
            progress_back.style.visibility = "hidden";
            progress_bar.style.visibility = "hidden";
            progress_bar.style.width = "0%"
            progress_bar.setAttribute("aria-valuenow", "0")
            displaying_progress = "empty";
        
        })
    }
}
document.querySelectorAll("#info_box + .row .col-1 img + img").forEach(function(element){
    element.addEventListener("mousemove", function(event){
        
        update_info(event.target.parentNode.id.toString())

    })
    element.addEventListener("mouseout", (event) => {
        update_info('Default')
    })
})

document.addEventListener("DOMContentLoaded", function() {
    let target = document.getElementById("Seeds");
    let farm = document.createElement("div");
    farm.id = "farm";
    for (let i = 0; i < 6;i++){
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 8; j++){
            let col = document.createElement("div");
            if (j == 0 || j == 7){
                col.className = "col-3"
            } else {
                col.className = "col-1"
                col.id = "plot" + j.toString() + "," + (i + 1).toString()
                field.push(new farm_plot(col))
            }
            row.appendChild(col)
        }
        farm.appendChild(row);
    }
    target.insertAdjacentElement('afterend', farm)
})
/* global function because all dragging in this page is done with the intention of sending prigin data*/
const drag = (event) => {
    event.dataTransfer.setData("text", event.target.parentNode.id)

}
/* same as above, no need risk of naming conflicts with only one drag/drop scheme*/
function allowDrop(event){
    event.preventDefault();
}

/* Checking if Boston has sunlight to determine background change growth rates of crops based on temp and daylight*/
fetch(`http://api.weatherapi.com/v1/current.json?key=${keys.weather}&q=02108&aqi=no`)
    .then(response => response.json())
    .then(data => {
        const daytime = data.current.is_day;
        if (daytime == 1){
            document.body.style.backgroundImage = "url('images/stardew_daytime.jpg')"
        } else {
            growth_rates['Melon'] -= .5
            growth_rates['Pumpkin'] -= .5
            growth_rates['Cauliflower'] -= .5
        }
        const temp_f = parseFloat(data.current.temp_f);
        if (temp_f > 70){
            growth_rates['Melon'] += .4;
        } else {
            growth_rates['Cauliflower'] += .4
            growth_rates['Pumpkin'] += .4;
        }
    })

/* fetch weather data on the Pumpkin capitol of america to determine sell prices*/
fetch(`http://api.weatherapi.com/v1/current.json?key=${keys.weather}&q=61550&aqi=no`)
    .then(response => response.json())
    .then(data =>{
        const temp_f = parseFloat(data.current.temp_f);
        if (temp_f < 70){
            prices['Pumpkin'] *= .65
        } else {
            prices['Pumpkin'] *= 1.2
        }
    })

/* fetch weather data on the Cauliflower capitol of america to determine sell prices*/
fetch(`http://api.weatherapi.com/v1/current.json?key=${keys.weather}&q=93901&aqi=no`)
    .then(response => response.json())
    .then(data =>{
        const temp_f = parseFloat(data.current.temp_f);
        if (temp_f < 70){
            prices['Cauliflower'] *= .65
        } else {
            prices['Cauliflower'] *= 1.2
        }
    })

/* fetch weather data on the Melon capitol of america to determine sell prices*/
fetch(`http://api.weatherapi.com/v1/current.json?key=${keys.weather}&q=93637&aqi=no`)
    .then(response => response.json())
    .then(data =>{
        
        const temp_f = parseFloat(data.current.temp_f);
        if (temp_f > 70){
            prices['Melon'] *= .65
        } else {
            console.log(temp_f)
            prices['Melon'] *= 1.2
        }
    })