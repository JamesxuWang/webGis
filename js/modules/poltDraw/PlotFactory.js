/**
 * Created by chenzpa on 2015/10/30.
 */
define([
    "dojo/_base/declare",
    'js/modules/poltDraw/ext/tailed_squad_combat.js'
], function (declare,
             TailedSquadCombat) {
    return declare("plot.PlotFactory", null, {
          ARC                   : "arc",
          ELLIPSE               : "ellipse",
          CURVE                 : "curve",
          CLOSED_CURVE          : "closedcurve",
          LUNE                  : "lune",
          SECTOR                : "sector",
          GATHERING_PLACE       : "gatheringplace",
          STRAIGHT_ARROW        : "straightarrow",
          ASSAULT_DIRECTION     : "assaultdirection",
          ATTACK_ARROW          : "attackarrow",
          TAILED_ATTACK_ARROW   : "tailedattackarrow",
          SQUAD_COMBAT          : "squadcombat",
          TAILED_SQUAD_COMBAT   : "tailedsquadcombat",
          FINE_ARROW            : "finearrow",
          CIRCLE                : "circle",
          DOUBLE_ARROW          : "doublearrow",
          X_ARROW               : "xarrow",
          POLYLINE              : "polyline",
          FREEHAND_POLYLINE     : "freehandpolyline",
          POLYGON               : "polygon",
          FREEHAND_POLYGON      : "freehandpolygon",
          RECTANGLE             : "rectangle",
          POINT                 : "point",
          MULTIPOINT            : "multipoint",
          TRIANGLE              : "triangle",
        
        
        constructor: function () {
            //console.log("plot.PlotFactory");
        },
        createPlot: function (type,points){
            switch (type){
                case this.TAILED_SQUAD_COMBAT:
                    return new TailedSquadCombat(points);
            }
            return null;
        }
    });
}) ;