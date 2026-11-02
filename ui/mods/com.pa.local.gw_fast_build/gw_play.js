// Galactic War only. Speeds up YOUR construction and factory output.
// Costs stay the same. NPC inventories do not get these mods.
// 100 finishes a paid build in about 1% of the normal time.
var BUILD_SPEED = 100;

(function () {
  if (window.__gwFastBuildInstalled) {
    return;
  }
  window.__gwFastBuildInstalled = true;

  var BUILD_ARMS = [
    "/pa/tools/commander_build_arm/commander_build_arm.json",
    "/pa/units/land/fabrication_bot/fabrication_bot_build_arm.json",
    "/pa/units/land/fabrication_bot_adv/fabrication_bot_adv_build_arm.json",
    "/pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json",
    "/pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv_build_arm.json",
    "/pa/units/land/fabrication_vehicle/fabrication_vehicle_build_arm.json",
    "/pa/units/land/fabrication_vehicle_adv/fabrication_vehicle_adv_build_arm.json",
    "/pa/units/land/bot_factory/bot_factory_build_arm.json",
    "/pa/units/land/bot_factory_adv/bot_factory_adv_build_arm.json",
    "/pa/units/land/vehicle_factory/vehicle_factory_build_arm.json",
    "/pa/units/land/vehicle_factory_adv/vehicle_factory_adv_build_arm.json",
    "/pa/units/land/bot_support_commander/bot_support_commander_tool_build_arm.json",
    "/pa/units/land/unit_cannon/unit_cannon_build_arm.json",
    "/pa/units/air/fabrication_aircraft/fabrication_aircraft_build_arm.json",
    "/pa/units/air/fabrication_aircraft_adv/fabrication_aircraft_adv_build_arm.json",
    "/pa/units/air/air_factory/air_factory_build_arm.json",
    "/pa/units/air/air_factory_adv/air_factory_adv_build_arm.json",
    "/pa/units/air/support_platform/support_platform_build_arm.json",
    "/pa/units/sea/fabrication_ship/fabrication_ship_build_arm.json",
    "/pa/units/sea/fabrication_ship_adv/fabrication_ship_adv_build_arm.json",
    "/pa/units/sea/fabrication_barge/fabrication_barge_build_arm.json",
    "/pa/units/sea/naval_factory/naval_factory_build_arm.json",
    "/pa/units/sea/naval_factory_adv/naval_factory_adv_build_arm.json",
    "/pa/units/orbital/orbital_fabrication_bot/orbital_fabrication_bot_build_arm.json",
    "/pa/units/orbital/orbital_factory/orbital_factory_build_arm.json",
    "/pa/units/orbital/orbital_launcher/orbital_launcher_build_arm.json",
  ];

  var FACTORIES = [
    "/pa/units/land/bot_factory/bot_factory.json",
    "/pa/units/land/bot_factory_adv/bot_factory_adv.json",
    "/pa/units/land/vehicle_factory/vehicle_factory.json",
    "/pa/units/land/vehicle_factory_adv/vehicle_factory_adv.json",
    "/pa/units/air/air_factory/air_factory.json",
    "/pa/units/air/air_factory_adv/air_factory_adv.json",
    "/pa/units/sea/naval_factory/naval_factory.json",
    "/pa/units/sea/naval_factory_adv/naval_factory_adv.json",
    "/pa/units/orbital/orbital_factory/orbital_factory.json",
    "/pa/units/orbital/orbital_launcher/orbital_launcher.json",
    "/pa/units/land/unit_cannon/unit_cannon.json",
  ];

  var MODS = [];
  _.forEach(BUILD_ARMS, function (file) {
    MODS.push({
      file: file,
      path: "construction_demand.metal",
      op: "multiply",
      value: BUILD_SPEED,
      _gwFastBuild: true,
    });
    MODS.push({
      file: file,
      path: "construction_demand.energy",
      op: "multiply",
      value: BUILD_SPEED,
      _gwFastBuild: true,
    });
  });
  _.forEach(FACTORIES, function (file) {
    MODS.push({
      file: file,
      path: "factory_cooldown_time",
      op: "replace",
      value: 0,
      _gwFastBuild: true,
    });
  });

  var playerInventory = function () {
    if (typeof model === "undefined" || !model.game || !model.game()) {
      return null;
    }
    var inventory = model.game().inventory();
    if (!inventory || !inventory.mods || !inventory.addMods) {
      return null;
    }
    return inventory;
  };

  var giveFastBuild = function (inventory) {
    var kept = _.reject(inventory.mods(), function (mod) {
      return mod && mod._gwFastBuild;
    });
    inventory.mods(kept.concat(MODS));
  };

  var proto = null;
  var inventory = playerInventory();
  if (inventory) {
    proto = Object.getPrototypeOf(inventory);
  }

  if (proto && !proto.__gwFastBuildWrapped && proto.applyCards) {
    var original = proto.applyCards;
    proto.applyCards = function (done) {
      var self = this;
      return original.call(self, function () {
        var player = playerInventory();
        if (player && self === player) {
          giveFastBuild(self);
        }
        if (done) {
          done();
        }
      });
    };
    proto.__gwFastBuildWrapped = true;
  }

  var attempts = 0;
  var tick = function () {
    var current = playerInventory();
    if (!current) {
      attempts += 1;
      if (attempts <= 50) {
        _.delay(tick, 200);
      }
      return;
    }
    if (current.applyCards) {
      current.applyCards();
    } else {
      giveFastBuild(current);
    }
    console.log("GW Fast Build active. Construction rate x" + BUILD_SPEED);
  };
  tick();
})();
