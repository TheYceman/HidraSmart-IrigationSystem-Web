const Plots = require("../models/plots.model");

async function getAllPlots(database) {
    const gePlots = [...(await Plots.getAllPlots(database))];
    return gePlots;
}

const Nodes = require("../models/nodes.model");

async function getAllNodes(database) {
    const geNodes = [...(await Nodes.getAllNodes(database))];
    return geNodes;
}

const NodesUnlocalized = require("../models/nodes-unlocalized.model.js");

async function getAllNodesUnlocalized(database) {
    const geNodesUnlocalized = [...(await NodesUnlocalized.getAllNodesUnlocalized(database))];
    return geNodesUnlocalized;
}

const Conductions = require("../models/conductions.model");

async function getAllConductions(database) {
    const geConductions = [...(await Conductions.getAllConductions(database))];
    return geConductions;
}

const NodesNetwork = require("../models/nodes-network.model.js/index.js");

async function getAllNodesNetwork(database) {
    const geNodesNetwork = [...(await NodesNetwork.getAllNodesNetwork(database))];
    return geNodesNetwork;
}

const TrafficConductions = require("../models/traffic-conductions.model");

async function getTrafficConductions(database) {
    const geTrafficConductions = [...(await TrafficConductions.getTrafficConductions(database))];
    return geTrafficConductions;
}


const DemandPlots = require("../models/demand-plots.model");

async function getAllDemandPlots(database) {
    const geDemandPlots = [...(await DemandPlots.getAllDemandPlots(database))];
    return geDemandPlots;
}

const Valve = require("../models/valve.model");

async function getAllValve(database) {
    console.log("LLAMANDO GETA,LVALLES");
    const geValve = [...(await Valve.getAllValve(database))];
    return geValve;
}

async function getData(pathFile) {
    try {
        const result = await Sensor.geoJsonDataExtraction(pathFile);
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

module.exports = { getAllPlots, getAllNodes, getAllNodesUnlocalized, getAllConductions, getAllNodesNetwork, getTrafficConductions, getAllDemandPlots, getAllValve };