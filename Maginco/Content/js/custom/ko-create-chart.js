var arrExcelData;
var arrSize;
var chartViewModel;

var enumCharts = {
    scatterPlot: "scatterPlot",
    streamGraph: "streamGraph",
    wordCloud: "wordCloud",
    bubbleChart: "bubbleChart",
    treemap: "treemap",
    forceDirectedGraph: "forceDirectedGraph",
    sunburstPartition: "sunburstPartition",
    sankey: "sankey",
    heatmap: "heatmap",
    radarChart: "radarChart",
    tilfordTree: "tilfordTree",
    collapsibleTree: "collapsibleTree",
    motionPlot: "motionPlot",
};
var enumDataTypes = {
    csv: "csv",
    tsv: "tsv"
};
var enumScales = {
    linear: "linear",
    log: "log"
};
var enumThemes = {
    spaceBlue: "spaceBlue",
    lavaRed: "lavaRed",
    jungleGreen: "jungleGreen",
    smokeGrey: "smokeGrey"
};

function ChartModel () {
    var self = this;

    self.isGridMode = ko.observable(false);
    self.showGridToggle = ko.observable(false);
    self.inputData = ko.observable();
    self.parsedData = ko.observable();
    self.chartName = ko.observable();
    self.title = ko.observable();
    self.scaleType = ko.observable();
    self.color = ko.observable();
    self.shapeSize = ko.observable();
    self.theme = ko.observable();
    self.fontFamily = ko.observable();
    self.titleSize = ko.observable('30');
    self.titleFont = ko.observable();
    self.showSaveButton = ko.observable(false);
    self.showLabels = ko.observable(true);
    self.fontSize = ko.observable('12');
    self.width = ko.observable('900');
    self.height = ko.observable('500');
    self.shapeIdentifier = 'chart-shape';
    self.lstTooltipElements = ko.observableArray();
    self.lstLegendIcons = ko.observableArray();
    self.lstDimensions = ko.observableArray();
    self.lstMeasures = ko.observableArray();
    self.lstHeaders = ko.observableArray();
    self.Hirarechya = ko.observableArray();
    self.Sizea = ko.observable();
    self.Colora = ko.observable();
    self.Xaxsisa = ko.observable(null);
    self.Yaxsisa = ko.observable(null);
    self.Labela = ko.observable();

    self.inputChange = function () {
        $("#form-file").submit();
    };

    self.submitFormFile = function () {
        var formdata = new FormData();
        var fileInput = $("#flExcel")[0];
        var file = fileInput.files[0];

        formdata.append(file.name, file);

        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {

                        $('#dv-progess-cotainer').show();

                        var percentComplete = evt.loaded / evt.total;

                        $('#dv-progress').css({
                            width: percentComplete * 100 + '%'
                        });

                        if (percentComplete === 1) {
                            $('#dv-progess-cotainer').fadeOut();
                        }
                    }
                }, false);

                return xhr;
            },
            url: "/User/UploadFile",
            method: "Post",
            data: formdata,
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false,
            traditional: true,
            success: function (res) {
                $("#txtExcelInput").val('');

                arrExcelData = JSON.parse(res);

                var template = $("#temp-sheet-names").html();
                var html = Mustache.to_html(template, arrExcelData);

                $("#dv-excel-data").html(html);
            },
            error: function (err) {
                Helper.alertUploadError();
            }
        });

        return false;
    }

    self.addDimension = function (text) {
        self.lstDimensions.push(text);
    };

    self.removeDimension = function (text) {
        var newArr = _.without(self.lstDimensions(), text);

        self.lstDimensions(newArr);
    };

    self.addMeasure = function (text) {
        self.lstMeasures.push(text);
    };

    self.removeMeasure = function (text) {
        var newArr = _.without(self.lstMeasures(), text);

        self.lstMeasures(newArr);
    };

    self.addLegendIcon = function (iconObject) {
        self.lstLegendIcons.push(iconObject);
    }

    self.addHeader = function (text) {
        self.lstHeaders.push(text);
    }

    self.updateTooltipData = function (arr) {
        self.lstTooltipElements(arr);
    }

    self.clearLegends = function () {
        self.lstLegendIcons([]);
    }

    self.clearHeaders = function () {
        self.lstHeaders([]);
    }

    self.parseCsv = function () {
        Helper.clearLists();

        self.parsedData(d3.csv.parse(self.inputData()));

        Helper.renderData();
        Helper.expandLists();

        self.lstDimensions([]);
        self.lstMeasures([]);
        self.lstLegendIcons([]);
    };

    self.parseTsv = function () {
        Helper.clearLists();

        self.parsedData(d3.tsv.parse(self.inputData()));

        Helper.renderData();
        Helper.expandLists();

        self.lstDimensions([]);
        self.lstMeasures([]);
        self.lstLegendIcons([]);
    };

    self.updateChart = function () {
        var tblData = $("#tbl-data-grid").tableToJSON();

        self.parsedData(tblData);
        Helper.clearTooltips();

        if (self.chartName() == enumCharts.scatterPlot) {
            generateScatterPlot();
        }
        else if (self.chartName() == enumCharts.streamGraph) {
            generateStreamGraph();
        }
        else if (self.chartName() == enumCharts.wordCloud) {
            generateWordCloud();
        }
        else if (self.chartName() == enumCharts.bubbleChart) {
            generateBubbleChart();
        }
        else if(self.chartName() == enumCharts.treemap) {
            generateTreemap();
        }
        else if (self.chartName() == enumCharts.forceDirectedGraph) {
            generateForceDirectedGraph();
        }
        else if (self.chartName() == enumCharts.sunburstPartition) {
            generateSunburstPartition();
        }
        else if (self.chartName() == enumCharts.sankey) {
            generateSankeyDiagram();
        }
        else if (self.chartName() == enumCharts.heatmap) {
            generateHeatmap();
        }
        else if (self.chartName() == enumCharts.radarChart) {
            generateRadarChart();
        }
        else if (self.chartName() == enumCharts.tilfordTree) {
            generateTilfordTree();
        }
        else if (self.chartName() == enumCharts.collapsibleTree) {
            generateCollapsibleTree();
        }
        else if (self.chartName() == enumCharts.motionPlot) {
            generateMotionPlot();
        }
    };

    self.ddlThemeChange = function () {
        $("svg").removeClass().addClass(chartViewModel.theme());
    };

    self.ddlSampleDataChange = function (d, e) {
        var fileName = e.target.value;

        if (fileName != 0) {
            $.ajax({
                "url": "/User/GetSampleData",
                "method": "Get",
                "data": { fileName: fileName },
                success: function (res) {

                    chartViewModel.inputData(res);

                    if (Helper.containsSubstring(fileName, "tsv")) {
                        $('.nav-tabs a[href="#tsv-data"]').tab('show');
                    }
                },
            });
        }
    };

    self.clrChange = function (d, e) {
        self.color(e.target.value);
       
        //d3.select(e.target).style("fill", e.target.value);
        $('.Slectedc').css('fill', e.target.value);
       $('.Slectedc').removeClass('Slectedc');
    };

    self.ddlShapeSizeChange = function () {
        var selected = self.shapeSize();

        if (self.chartName() == enumCharts.scatterPlot || self.chartName() == enumCharts.bubbleChart) {
            $("svg circle").each(function (i, v) {
                var newSize;

                if (selected == "1") {
                    newSize = (arrSize[i] / 100) * 5;
                }
                else if (selected == "2") {
                    newSize = (arrSize[i] / 100) * 20;
                }
                else if (selected == "3") {
                    newSize = arrSize[i];
                }
                else if (selected == "4") {
                    newSize = arrSize[i] + ((arrSize[i] / 100) * 45);
                }
                else if (selected == "5") {
                    newSize = arrSize[i] + ((arrSize[i] / 100) * 65);
                }

                $(this).animate(
                    {
                        "r": newSize
                    },
                    {
                        duration: 1000,
                        step: function (now) {
                            $(this).attr("r", now);
                        }
                    });
                });
        }
        else if (self.chartName() == enumCharts.wordCloud) {
            $("svg text").each(function (i, v) {
                var newSize;

                if (selected == "1") {
                    newSize = (arrSize[i] / 100) * 40;
                }
                else if (selected == "2") {
                    newSize = (arrSize[i] / 100) * 60;
                }
                else if (selected == "3") {
                    newSize = arrSize[i];
                }
                else if (selected == "4") {
                    newSize = arrSize[i] + ((arrSize[i] / 100) * 50);
                }
                else if (selected == "5") {
                    newSize = arrSize[i] + ((arrSize[i] / 100) * 65);
                }

                $(this).animate(
                    {
                        "font-size": newSize + "px"
                    },
                    {
                        duration: 1000,
                        step: function (now) {
                            $(this).attr("font-size", now);
                        }
                    });
            });
        }
    };

    self.toggleLabels = function (d, e) {
        var labels = $("svg label");
        var texts = $("svg text");

        if (self.showLabels()) {
            $(labels).show();
            $(texts).show();
        }
        else {
            $(labels).hide();
            $(texts).hide();
        }
    };

    self.toggleGridMode = function () {
        self.isGridMode(!self.isGridMode());
    };

    self.saveChart = function () {

        var svgString = $("svg")[0].outerHTML;

        var chart = {
            strName: self.chartName(),
            strSvgContent: svgString.trim()
        };

        $.ajax({
            url: "/User/SaveChart",
            method: "POST",
            data: chart,
            success: function (res) {
                Helper.alertSuccess("Chart saved successfully.");
            },
            error: function (err) {
                Helper.alertError("Something went wrong. Unable to save chart.");
                console.log(err.responseText);
            }
        });
    };

    self.GFFChange = function () {
        this.updateChart();
    }

    self.GWChange = function () {
        this.updateChart();
    }

    self.GHChange = function () {
        this.updateChart();
    }

    self.ALchange = function () {
        this.updateChart();
    }

    self.ddlScalechange = function () {
        this.updateChart();
    }

    self.scatterPlot = function () {
        self.chartName(enumCharts.scatterPlot);
        generateScatterPlot();
        Helper.renderGridData();
        self.showSaveButton(true);
    };

    self.streamGraph = function () {
        self.chartName(enumCharts.streamGraph);
        generateStreamGraph();
        Helper.renderGridData();
        self.showSaveButton(true);
    };

    self.wordCloud = function () {
        self.chartName(enumCharts.wordCloud);
        generateWordCloud();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.bubbleChart = function () {
        self.chartName(enumCharts.bubbleChart);
        generateBubbleChart();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.treeMap = function () {
        self.chartName(enumCharts.treemap);
        generateTreemap();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.forceDirectedGraph = function () {
        self.chartName(enumCharts.forceDirectedGraph);
        generateForceDirectedGraph();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.sunburstPartition = function () {
        self.chartName(enumCharts.sunburstPartition);
        generateSunburstPartition();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.sankeyDiagram = function () {
        self.chartName(enumCharts.sankeyDiagrams);
        generateSankeyDiagram();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.heatmap = function () {
        self.chartName(enumCharts.heatmap);
        generateHeatmap();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.radarChart = function () {
        self.chartName(enumCharts.radarChart);
        generateRadarChart();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.tilfordTree = function () {
        self.chartName(enumCharts.tilfordTree);
        generateTilfordTree();
        Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.collapisbleTree = function () {
        self.chartName(enumCharts.collapsibleTree);
        generateCollapsibleTree();
       Helper.renderGridData();
        self.showSaveButton(true);
    }

    self.motionPlot = function () {
        self.chartName(enumCharts.motionPlot);
        generateMotionPlot();
        Helper.renderGridData();
        self.showSaveButton(true);
    }
};

var Helper = new function () {
   
    $(document).on('click', '#close-icon', function() {
        $(this).parent().slideUp("fast", function () {
            var name = $(this).html();
            var id = $(this).parent().attr('id');
            $(this).remove()
            if(id == "dv-hirarchy-container")
            {
                var newarr = _.without(chartViewModel.Hirarechya, name);
                chartViewModel.Hirarechya(newarr);
                chartViewModel.updateChart();
            }
            if (id == "dv-label-container") {
                chartViewModel.Labela = "";
                chartViewModel.updateChart();
            }
            if (id == "dv-size-container") {
                chartViewModel.Sizea = "";
                chartViewModel.updateChart();
                chartViewModel.ddlShapeSizeChange();
            }
            if (id == "dv-color-container") {
                chartViewModel.Colora = "";
                chartViewModel.updateChart();
            }
            if (id == "dv-xaxsis-container") {
                chartViewModel.Xaxsisa = "";
                chartViewModel.updateChart();
            }
            if (id == "dv-yaxsis-container") {
                chartViewModel.Yaxsisa = "";
                chartViewModel.updateChart();
            }
        });
    });
    this.initTooltips = function () {
        $('[data-toggle="tooltip"]').tooltip();
    }

    this.initFileUpload = function () {
        $(":file").filestyle();
    }

    this.initLists = function () {

        $('#lst-measures').multiselect({

            buttonClass: 'form-control text-left',
            buttonWidth: '150px',
            buttonText: function (options, select) {
                return "Select Measures";
            },
            onChange: function (element, checked) {

                var active = $(element).text();

                if (checked) {
                    chartViewModel.addMeasure(active);
                    Helper.appendLabel("dv-measures-container", active);
                }
                else {
                    chartViewModel.removeMeasure(active);
                    Helper.removeLabel("dv-measures-container", active);
                }
            }
        });

        $('#lst-dimensions').multiselect({

            buttonClass: 'form-control text-left',
            buttonWidth: '150px',
            buttonText: function (options, select) {
                return "Select Dimensions";
            },
            onChange: function (element, checked) {

                var active = $(element).text();

                if (checked) {
                    chartViewModel.addDimension(active);
                    Helper.appendLabel("dv-dimensions-container", active);
                }
                else {
                    chartViewModel.removeDimension(active);
                    Helper.removeLabel("dv-dimensions-container", active);
                }
            }
        });
    }

    this.appendLists = function (measures, dimensions) {

        //$("#lst-measures").append(measures.join(''));
        $("#listitem").append(measures);
        $("#listitem").append(dimensions);
        $("#listitem li").draggable({
            scroll: false,
            cursor: 'move',
            helper: 'clone',
        });
        $("#listitem li").addClass("Real-Attr");
        //$('#single').multiselect('rebuild');
        //$('#single').multiselect('rebuild');
    }

    this.clearLists = function () {
        $("#listitem").html('');

        $('#dv-hirarchy-container').children().not('p').remove();
        $('#dv-label-container').children().not('p').remove();
        $('#dv-size-container').children().not('p').remove();
        $('#dv-color-container').children().not('p').remove();
        $('#dv-xaxsis-container').children().not('p').remove();
        $('#dv-yaxsis-container').children().not('p').remove();
    }

    this.clearTooltips = function () {
        $('.tip').remove();
    }

    this.renderData = function () {
        var optStart = '<li id="droplist" class= "list-group-item" style="margin:2px;margin-left:20px">';
        var optEnd = "</li>";
        var separator = "-";
        var value;
        var lstDimensions = [];
        var lstMeasures = [];
        var sampleObject;

        try {

            sampleObject = chartViewModel.parsedData()[0];

            for (var property in sampleObject) {

                value = sampleObject[property]
                if (Helper.isNumber(value)) {
                    //lstMeasures.push(optStart + property.toUpperCase() + '<span id="mydata"> || integer</span>' + optEnd);
                    lstMeasures.push(optStart + property + '<span id="mydata"> || integer</span>' + optEnd);
                
                }
                else {
                    //lstDimensions.push(optStart + property.toUpperCase() + '<span id = "mydata"> || string</span>' + optEnd);
                    lstDimensions.push(optStart + property + '<span id = "mydata"> || string</span>' + optEnd);
                }
            }
        } catch (e) {
            Helper.alertError("Input data is not valid.");
        }

        Helper.appendLists(lstMeasures, lstDimensions);
    }

    this.initWidgets = function () {
        $("#dv-hirarchy-container, #dv-label-container, #dv-size-container, #dv-color-container, #dv-xaxsis-container, #dv-yaxsis-container ").droppable({
            accept: ".list-group-item",
           
            drop: function (ev, ui) {
                var c = $(ui.helper).find("span#mydata").text();
               $(ui.helper).find("span#mydata").remove();
                if ($(this).attr("id") == 'dv-hirarchy-container' && !$('#dv-hirarchy-container li:contains("' + $(ui.helper).html() + '")').length) {
                    $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                    var atv = $(ui.helper).html();
                    //var p = $(ui.helper).html();
                    //var atv = p.toLowerCase();
                    chartViewModel.Hirarechya.push(atv);
                    chartViewModel.updateChart();
                }
                if($(this).attr("id") == 'dv-label-container' && !$('#dv-label-container li:contains("' + $(ui.helper).html() + '")').length)
                {
                    if ($(this).children('li').length > 0) {
                        $(this).children('li').remove();
                        chartViewModel.Labela = "";
                    }
                    $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                    chartViewModel.Labela = $(ui.helper).html();
                    //var p = $(ui.helper).html();
                    //chartViewModel.Labela = p.toLowerCase();
                    chartViewModel.updateChart();
                }
                if ($(this).attr("id") == 'dv-size-container' && !$('#dv-size-container li:contains("' + $(ui.helper).html() + '")').length) {
                    if (c == " || integer") {
                        if ($(this).children('li').length > 0) {
                            $(this).children('li').remove();
                            chartViewModel.Sizea = "";
                        }
                        $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                        chartViewModel.Sizea = $(ui.helper).html();
                        //var p = $(ui.helper).html();
                        //chartViewModel.Sizea = p.toLowerCase();
                        chartViewModel.updateChart();
                        
                    }
                }
                if ($(this).attr("id") == 'dv-color-container' && !$('#dv-color-container li:contains("' + $(ui.helper).html() + '")').length) {
                    if ($(this).children('li').length > 0) {
                        $(this).children('li').remove();
                        chartViewModel.Colora = "";
                    }
                    $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                    chartViewModel.Colora = $(ui.helper).html();
                    //var p = $(ui.helper).html();
                    //chartViewModel.Colora = p.toLowerCase();
                    chartViewModel.updateChart();
                }
                if ($(this).attr("id") == 'dv-xaxsis-container' && !$('#dv-xaxsis-container li:contains("' + $(ui.helper).html() + '")').length) {
                    if (c == " || integer") {
                    if ($(this).children('li').length > 0) {
                        $(this).children('li').remove();
                        chartViewModel.Xaxsisa = "";
                    }
                    $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                    chartViewModel.Xaxsisa = $(ui.helper).html();
                    //var p = $(ui.helper).html();
                    //chartViewModel.Xaxsisa = p.toLowerCase();
                    chartViewModel.updateChart();
                }
                }
                if ($(this).attr("id") == 'dv-yaxsis-container' && !$('#dv-yaxsis-container li:contains("' + $(ui.helper).html() + '")').length) {
                    if (c == " || integer") {
                    if ($(this).children('li').length > 0) {
                        $(this).children('li').remove();
                        chartViewModel.Yaxsisa = "";
                    }               
                        $(this).append('<li>' + $(ui.helper).html() + '<span class="close" id = "close-icon" >&times;</span>' + '</li>');
                        chartViewModel.Yaxsisa = $(ui.helper).html();
                        //var p = $(ui.helper).html();
                        //chartViewModel.Yaxsisa = p.toLowerCase();
                        chartViewModel.updateChart();
                    }
                }
                }
        }).sortable();
        $("#dv-customization-widget").draggable();
        $("#dv-thumbs-widget").draggable();
        $("#dv-theming-widget").draggable();
    };

    this.expandLists = function () {
        $("#dv-dimensions").collapse();
        $("#dv-measures").collapse();
    }

    this.appendLabel = function (parent, text) {

        var label = document.createElement("label");

        label.innerText = text;
        label.className = "label-warning hidden";

        $("#" + parent).append(label);
        $(label).fadeIn('500');
    }

    this.removeLabel = function (parent, text) {

        var selector = "#" + parent + " label:contains('" + text + "')";
        
        $(selector).fadeOut('500', function () {
            $(selector).remove();
        });
    }

    this.isNumber = function (stringToCheck) {
        return !isNaN(parseFloat(stringToCheck)) && isFinite(stringToCheck);
    }

    this.isString = function (stringToCheck) {

        var regAlphabet = /^([a-zA-Z0-9]+)$/;

        return regAlphabet.test(stringToCheck);
    }

    this.isDate = function (stringToCheck) {
        var formats = ["DD/MM/YYYY", "DD/MM/YY", "DD/MM/YYYY HH:MM:SS", "DD-MM-YYYY", "DD-MM-YY", "DD-MM-YYYY HH:MM:SS"];
        var isValidDate = false;

        for (var i = 0; i < formats.length; i++) {

            isValidDate = moment(stringToCheck, formats[i], true).isValid();

            if (isValidDate) {
                break;
            }
        }

        return isValidDate;
    }
    
    this.isNotEmpty = function (stringToCheck) {

        if (stringToCheck == undefined || stringToCheck == null) {
            return false;
        }

        return stringToCheck.trim().length > 0;
    }

    this.isPresentInLegend = function (text) {
        var isPresent = false;

        for (var i = 0; i < chartViewModel.lstLegendIcons().length ; i++) {
            if (chartViewModel.lstLegendIcons()[i].name == text) {
                isPresent = true;
                break;
            }
        }

        return isPresent;
    };

    this.containsSubstring = function (mainString, subString) {
        return mainString.indexOf(subString) > -1;
    }

    this.create2DArray = function (size) {
        var arr = [];

        while (size--) {
            arr.push([]);
        }

        return arr;
    }

    this.scrollTo = function (parent) {
        $('html, body').animate({
            scrollTop: $("#" + parent).offset().top
        }, 500);
    }

    this.focusSvgContainer = function () {
        $('html, body').animate({
            scrollTop: $("#dv-chart-container").offset().top
        }, 500);
    }

    this.clearSvgContainer = function () {
        $("#dv-chart-container").children().remove();
    }

    this.addAxisLabels = function (xAxisText, yAxisText, height, width) {

        var style = "font-family:" + chartViewModel.fontFamily() + ";font-size:" + chartViewModel.fontSize() + "px;text-align:left;";

        var xLblContainer = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        var yLblContainer = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");

        var xDiv = document.createElement('div');
        var yDiv = document.createElement('div');

        xLblContainer.setAttribute('width', 250);
        xLblContainer.setAttribute('height', 20);
        xLblContainer.setAttribute('x', width / 2);
        xLblContainer.setAttribute('y', height + 30);

        yLblContainer.setAttribute('width', 100);
        yLblContainer.setAttribute('height', 20);
        yLblContainer.setAttribute('x', -150);
        yLblContainer.setAttribute('y', 10);
        yLblContainer.setAttribute('transform', 'rotate(-90)');

        xDiv.setAttribute('contenteditable', true);
        xDiv.setAttribute('style', style);

        yDiv.setAttribute('contenteditable', true);
        yDiv.setAttribute('style', style);

        xDiv.innerText = xAxisText;
        yDiv.innerText = yAxisText;

        
        xLblContainer.appendChild(xDiv);
        yLblContainer.appendChild(yDiv);

        
        document.querySelector("svg").appendChild(xLblContainer);
        document.querySelector("svg").appendChild(yLblContainer);
    };

    this.alertSuccess = function (msg) {
        $("#lbl-success").text(msg);
        $('#dv-success-modal').modal('show');
    }

    this.alertError = function (msg) {
        $("#lbl-error").text(msg);
        $('#dv-error-modal').modal('show');
    }

    this.showParamsWarning = function (arrDataPoints) {

        var template = $("#temp-params-warning").html();
        var html = Mustache.to_html(template, arrDataPoints);

        $("#lst-params-warning").html(html);

        $("#alert-data-warning").fadeIn();

        Helper.scrollTo("dv-alerts-container");
    };

    this.showTooltip = function (xPos, yPos) {
        $(".tip").css({
            "left": xPos + "px",
            "top": yPos + "px",
        });

        $(".tip").fadeIn();
    }

    this.hideTooltip = function () {
        $(".tip").hide();
    }

    this.renderGridData = function () {
        chartViewModel.clearHeaders();

        var singleRow;
        var arrColumns;
        var val;
        var template = $("#temp-data-grid").html();

        var containerObject = {
            headers: [],
            rows: []
        };

        for (var i = 0; i < chartViewModel.parsedData().length; i++) {
            singleRow = chartViewModel.parsedData()[i];
            arrColumns = [];

            for (var property in singleRow) {

                val = singleRow[property];

                if (this.containsSubstring(chartViewModel.Hirarechya(), property) || chartViewModel.Labela == property || chartViewModel.Colora == property || chartViewModel.Yaxsisa == property || chartViewModel.Xaxsisa == property || chartViewModel.Sizea == property) {
                    arrColumns.push(val);

                    if (!(this.containsSubstring(chartViewModel.lstHeaders(), property))) {
                        chartViewModel.addHeader(property);
                    }
                }
            }

            containerObject.rows.push({
                columns: arrColumns
            });
        }

        containerObject.headers = chartViewModel.lstHeaders();

        $("#tbl-data-grid").html(Mustache.to_html(template, containerObject));

        chartViewModel.toggleGridMode(true);
        chartViewModel.showGridToggle(true);
    }

    this.alertUploadError = function () {
        $('#alert-upload-success').hide();
        $('#alert-upload-error').fadeIn();
    }

    this.getColors = function (count) {

        var distribution = 360 / (count - 1);
        var result = [];
        var hex;

        for (var i = 0; i < count; i++) {

            hex = hsvToHex(distribution * i, 100, 100);

            result.push(hex);
        }

        return result;

        function hsvToHex(h, s, v) {

            var red, green, blue;
            var r, g, b;
            var i;
            var f, p, q, t;

            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));

            s /= 100;
            v /= 100;

            if (s == 0) {
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

            h /= 60;
            i = Math.floor(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));

            switch (i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;

                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;

                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;

                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;

                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;

                default:
                    r = v;
                    g = p;
                    b = q;
            }

            red = Math.round(r * 255);
            green = Math.round(g * 255);
            blue = Math.round(b * 255);

            return "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
        }
    }

    this.getSheetData = function (sheetName) {
        var result = arrExcelData.filter(function (obj) {
            return obj.name == sheetName;
        });

        return result[0].data;
    }

    this.getLastElement = function (arr) {
        return arr[arr.length - 1];
    }

    this.csvToTree = function (csvData, groups) {

        var genGroups = function (data) {
            return _.map(data, function (element, index) {
                return { name: index, children: element };
            });
        };

        var nest = function (node, curIndex) {
            if (curIndex === 0) {
                node.children = genGroups(_.groupBy(csvData, groups[0]));
                _.each(node.children, function (child) {
                    nest(child, curIndex + 1);
                });
            }
            else {
                if (curIndex < groups.length) {
                    node.children = genGroups(
                      _.groupBy(node.children, groups[curIndex])
                    );
                    _.each(node.children, function (child) {
                        nest(child, curIndex + 1);
                    });
                }
            }
            return node;
        };

        return nest({}, 0);
    }
}

$(function () {

    chartViewModel = new ChartModel();

    var shapeSelector = "svg ." + chartViewModel.shapeIdentifier;

    ko.applyBindings(chartViewModel, document.getElementById("ko-create-chart"));

    Helper.initTooltips();

    Helper.initLists();

    Helper.initFileUpload();

    Helper.initWidgets();

    $("#dv-excel-data").on("change", "input[name=chkSheetName]", function () {
        var sheet = $(this).val().trim();
        var data = Helper.getSheetData(sheet);

        chartViewModel.inputData(data);

        $("#txtExcelInput").slideDown();

        chartViewModel.parseCsv();
    });

    $("#dv-chart-container")
        .on("mouseover", shapeSelector.toString(), function () {
        var itemClass = $(this).attr("data-legend");

        $(shapeSelector.toString()).each(function (i, v) {
            if ($(v).attr("data-legend") == itemClass) {
                $(this).css("fill-opacity", "0.9");
            }
            else {
                $(this).css("fill-opacity", "0.1");
            }
        });
    })
        .on("mouseleave", shapeSelector.toString(), function () {
            $(shapeSelector.toString()).each(function (i, v) {
                if (chartViewModel.chartName() == enumCharts.scatterPlot) {
                    $(this).css("fill-opacity", "0.5");
                }
                else {
                    $(this).css("fill-opacity", "0.9");
                }
        });
    });

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#context-menu").length > 0) {
            $("#context-menu").hide(100);
        }
    });

    $("#dv-legend").on("click", ".check-legend", function () {
        var showLegendItems = $(this).prop("checked");
        var legendItem = $(this).attr("data-legend");
        var itemsSelector = shapeSelector + "[data-legend='" + legendItem + "']";

        d3.selectAll(itemsSelector.toString())
            .transition()
            .duration(500)
            .style({
                "opacity": function () {
                    return showLegendItems ? "1" : "0";
                }
            });
    });
});

function generateScatterPlot() {

    if (chartViewModel.Xaxsisa.length > 0 && chartViewModel.Yaxsisa.length > 0) {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();
        chartViewModel.clearLegends();

        //var selectedMeasureOne = chartViewModel.Xaxsisa
        //var selectedMeasureTwo = chartViewModel.lstMeasures()[1];
        var selectedMeasureThree = chartViewModel.Sizea.length>0 ?chartViewModel.Sizea : "";
        var selectedDimension = chartViewModel.Colora.length>0 ?chartViewModel.Colora : "";
        var selectedMeasureOne = chartViewModel.Xaxsisa;
        var selectedMeasureTwo = chartViewModel.Yaxsisa;

        var margin = { top: 20, right: 40, bottom: 30, left: 20 };

        var height = chartViewModel.height() - margin.top - margin.bottom; //400
        var width = chartViewModel.width() - margin.left - margin.right;  //800
        var totalWidth = width + margin.right + margin.left;
        var totalHeight = height + margin.top + margin.bottom;
        var xLabelWidth = 0;
        var yLabelWidth = 0;
        var longest = 0;
        var maxBubbleSize = 50;
        var yScale;
        var xScale;

        arrSize = [];

        if (chartViewModel.scaleType() == enumScales.log) {

            xScale = d3.scale.log()
                      .domain([1, d3.max(chartViewModel.parsedData(), function (d) {

                          var strNumber = d[selectedMeasureOne];

                          if (strNumber.length > longest) {
                              longest = strNumber.length;
                          }

                          return parseInt(strNumber);
                      })])
                      .range([0, width]);

            yScale = d3.scale.log()
                            .domain([1, d3.max(chartViewModel.parsedData(), function (d) {

                                var strNumber = d[selectedMeasureTwo];

                                return parseInt(strNumber);
                            })])
                            .range([height, 0]);
        }
        else {

            xScale = d3.scale.linear()
                      .domain([0, d3.max(chartViewModel.parsedData(), function (d) {

                          var strNumber = d[selectedMeasureOne];

                          if (strNumber.length > longest) {
                              longest = strNumber.length;
                          }

                          return parseInt(strNumber);
                      })])
                      .range([0, width]);

            yScale = d3.scale.linear()
    	                .domain([0, d3.max(chartViewModel.parsedData(), function (d) {

    	                    var strNumber = d[selectedMeasureTwo];

    	                    return parseInt(strNumber);
    	                })])
    	                .range([height, 0]);
        }

        var sizeScale = d3.scale.linear()
                        .domain([1, d3.max(chartViewModel.parsedData(), function (d) {
                            var strSize = d[selectedMeasureThree];
                            return parseInt(strSize);
                        })])
    	                .range([2, maxBubbleSize]);

        var colorScale = d3.scale.category10();

        var xAxis = d3.svg
                        .axis()
                        .scale(xScale)
                        .orient('bottom');

        var yAxis = d3.svg
                        .axis()
                        .scale(yScale)
                        .orient('left');

        var svg = d3.select("#dv-chart-container")
                       .append('svg')
                       .attr({
                           'width': totalWidth,
                           'height': totalHeight,
                           'class': chartViewModel.theme(),
                       })
                       .append("g")
                       .attr("id", "g-main");

        Helper.addAxisLabels(selectedMeasureTwo, selectedMeasureOne, totalHeight, totalWidth);

        svg.selectAll("text")
           .data(yScale.ticks())
           .enter()
           .append("text")
           .text(function (d) {
               return yScale.tickFormat()(d);
           })
           .each(function (d) {
               yLabelWidth = Math.max(this.getBBox().width + yAxis.tickSize() + yAxis.tickPadding(), yLabelWidth);
           })
           .remove();

        svg.attr({
            "transform": "translate(" + Math.max(0, yLabelWidth) + ", 0)",
        });

        xLabelWidth = ((totalWidth / 100) * longest) * 1.5;

        d3.select("svg").attr({
            "width": totalWidth + yLabelWidth,
            "height": totalHeight + xLabelWidth,
        });

        svg.append('g')
            .attr({
                'transform': 'translate(' + yLabelWidth + ',' + (height + xLabelWidth) + ')',
                'class': 'scatter-axis'
            })
            .call(xAxis)
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        svg.append('g')
            .attr({
                'transform': 'translate(' + yLabelWidth + ',' + xLabelWidth + ')',
                'class': 'scatter-axis'
            })
            .call(yAxis)
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        svg.selectAll(chartViewModel.shapeIdentifier)
            .data(chartViewModel.parsedData())
            .enter()
            .append("circle")
            .attr({
                "cx": function (d, i) {
                    return xScale(d[selectedMeasureOne]) + yLabelWidth;
                },
                "cy": function (d, i) {
                    return yScale(d[selectedMeasureTwo]) + xLabelWidth;
                },
                "r": function (d, i) {
                    var flSize = parseFloat(d[selectedMeasureThree]);

                    if (isNaN(flSize)) {
                        arrSize.push(20);
                        return 20;
                    }

                    var scaledSize = sizeScale(flSize);

                    arrSize.push(scaledSize);

                    return scaledSize;
                },
                "data-legend": function(d, i) {
                    if(Helper.isNotEmpty(selectedDimension)){
                        return d[selectedDimension];
                    }
                },
                "class": chartViewModel.shapeIdentifier,
              
            })
            .style({
                "fill": function (d) {
                    if (Helper.isNotEmpty(selectedDimension)) {
                        var scaledColor = colorScale(d[selectedDimension]);

                        if (!Helper.isPresentInLegend(d[selectedDimension])) {
                            chartViewModel.addLegendIcon({
                                name: d[selectedDimension],
                                color: scaledColor,
                            });
                        };

                        return scaledColor;
                    }
                },
                "fill-opacity": "0.5"
            })
            .on('mouseover', function (d) {

                var data = [
                    {
                        key: 'X-Axis',
                        value: d[selectedMeasureOne]
                    },
                    {
                        key: 'Y-Axis',
                        value: d[selectedMeasureTwo]
                    },
                    {
                        key: 'Size',
                        value: d[selectedMeasureThree] == "" ? "Auto" : d[selectedMeasureThree]
                    }
                ];

                chartViewModel.updateTooltipData(data);

                Helper.showTooltip(d3.event.pageX - 20, d3.event.pageY - 70);
            })
            .on('mouseout', function (d) {
                Helper.hideTooltip();
            })
            .on('contextmenu', function () {
                event.preventDefault();

                colorSource = event.target;
                
                $("#context-menu").show().
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
                $(".chart-shape").removeClass('Slectedc');
                $(this).addClass('Slectedc');
            });

        $("svg").attr("height", totalHeight + maxBubbleSize);
        $("#g-main").attr("transform", 'translate(' + xLabelWidth + ', ' + (maxBubbleSize - 30) + ')');
    }
    else {
        Helper.showParamsWarning(["Add Scale for X-axis Attribute in 5.", "Add Scale for Y-axis Attribute 6.", "Add Scales for Size and Cluster Coloring in 3 and 4 Respectively(Optional)."]);
    }
}

function generateStreamGraph() {

    //var dimensions = chartViewModel.lstDimensions();
    //var selectedMeasure = chartViewModel.lstMeasures()[0];
    var dimensions = chartViewModel.Hirarechya().slice();
    var selectedMeasure = chartViewModel.Sizea;

    if (dimensions.length > 1 && Helper.isNotEmpty(selectedMeasure)) {

        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        chartViewModel.clearLegends();

        var selectedDimensionOne = dimensions[0];
        var selectedDimensionTwo = dimensions[1];

        var label;
        var yLabelWidth = 0;
        var xLabelWidth = 0;
        var longest = 0;
        var margin = { top: 20, right: 40, bottom: 30, left: 30 };
        var width = chartViewModel.width() - margin.left - margin.right; //900
        var height = chartViewModel.height() - margin.top - margin.bottom; //400
        var colorScale = d3.scale.category10();
        var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tip")
                    .style("opacity", 0);

        var xScale = d3.scale
                    .ordinal()
                    .rangeRoundBands([0, width], .1);

        var yScale = d3.scale
                    .linear()
                    .range([height, 0]);

        var xAxis = d3.svg
                    .axis()
                    .scale(xScale)
                    .orient("bottom");

        var yAxis = d3.svg
                    .axis()
                    .scale(yScale);

        var stack = d3.layout
                    .stack()
                    .offset("silhouette")
                    .values(function (d) { return d.values; })
                    .x(function (d) { return d[selectedDimensionTwo]; })
                    .y(function (d) { return d[selectedMeasure]; });

        var nest = d3.nest()
                    .key(function (d) { return d[selectedDimensionOne]; });

        var area = d3.svg
                    .area()
                    .interpolate("cardinal")
                    .x(function (d) { return xScale(d[selectedDimensionTwo]) + yLabelWidth; })
                    .y0(function (d) { return yScale(d.y0) - 1; })
                    .y1(function (d) { return yScale(d.y0 + d.y); });

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width + margin.left + margin.right,
                        "height": height + margin.top + margin.bottom,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var tip = d3.select("svg")
                    .append("text")
                    .attr({
                        "x": "50%",
                        "y": "5%"
                    })
                    .style({
                        "font-family": chartViewModel.fontFamily(),
                        "font-size": chartViewModel.fontSize()
                    });

        chartViewModel.parsedData().forEach(function (d) {
            d[selectedMeasure] = +d[selectedMeasure];
        });

        var layers = stack(nest.entries(chartViewModel.parsedData()));

        xScale.domain(chartViewModel.parsedData().map(function (d) {
            label = d[selectedDimensionTwo];

            if (label.length > longest) {
                longest = label.length;
            }

            return label;
        }));

        yScale.domain([0, d3.max(chartViewModel.parsedData(), function (d) { return d.y0 + d.y; })]);

        svg.selectAll("text")
            .data(yScale.ticks())
            .enter()
            .append("text")
            .text(function (d) {
                return yScale.tickFormat()(d);
            })
            .each(function (d) {
                yLabelWidth = Math.max(this.getBBox().width + yAxis.tickSize() + yAxis.tickPadding(), yLabelWidth);
            })
            .remove();

        xLabelWidth = ((height / 100) * longest) * 2;

        d3.select("svg").attr({
            "width": (width + margin.left + margin.right) + yLabelWidth,
            "height": (height + margin.top + margin.bottom) + xLabelWidth,
        });

        svg.selectAll(chartViewModel.shapeIdentifier)
            .data(layers)
            .enter()
            .append("path")
            .attr({
                "class": chartViewModel.shapeIdentifier,
                "d": function (d) { return area(d.values); },
                "data-legend": function (d, i) {
                        return d.key;
                },
            })
            .style({
                "fill": function (d, i) {
                    var scaledColor = colorScale(d.key);

                    if (!Helper.isPresentInLegend(d.key)) {
                        chartViewModel.addLegendIcon({
                            name: d.key,
                            color: scaledColor,
                        });
                    };

                    return scaledColor;
                },
                "stroke": "transparent",
                "fill-opacity": 0.9
            })
            .on("contextmenu", function (d) {
                var event = d3.event;
                event.preventDefault();

                colorSource = event.target;

                $("#context-menu").show().css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            });


        svg.append("g")
            .attr({
                "transform": "translate(" + yLabelWidth + "," + (height) + ")"
            })
            .call(xAxis)
            .style({
                "text-anchor": "end",
                "fill": "none",
                "shape-rendering": "crispEdges"
            })
            .selectAll("text")
            .style({
                "text-anchor": "end",
                "transform": "rotate(-50deg)",
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            })
            .attr({
                "x": "-10",
                "y": "5"
            });

        svg.append("g")
            .attr({
                "transform": "translate(" + yLabelWidth + ", 0)"
            })
            .call(yAxis.orient("left"))
            .style({
                "text-anchor": "end",
                "fill": "none",
                "shape-rendering": "crispEdges",
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function (d, i) {
                tooltip.transition()
                       .duration(200)
                       .style("opacity", .9);

                tooltip.html(d.key)
                        .style("left", (d3.event.pageX - 15) + "px")
                        .style("top", (d3.event.pageY - 36) + "px");
            })
            .on("mouseout", function (d, i) {
                tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
            });

        Helper.addAxisLabels(selectedDimensionOne, selectedDimensionTwo, height, width);
    }
    else {
        Helper.showParamsWarning(["Dimension for X-Axis label.", "Dimension for Y-Axis label.", "Measure for size."]);
    }
}

function generateWordCloud() {

    var selectedDimension = chartViewModel.Labela;
    var selectedMeasure = chartViewModel.Sizea;

    if (Helper.isNotEmpty(selectedDimension) && Helper.isNotEmpty(selectedMeasure))
    {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        chartViewModel.clearLegends();

        var width = chartViewModel.width();
        var height = chartViewModel.height();
        var color = d3.scale.category20();
        var sizeScale = d3.scale.linear().range([5, 150]);
        
        arrSize = [];

        sizeScale.domain([
            d3.min(chartViewModel.parsedData(), function (d) {
                return parseFloat(d[selectedMeasure]);
            }),
            d3.max(chartViewModel.parsedData(), function (d) {
                return parseFloat(d[selectedMeasure]);
            })
        ]);

        d3.layout.cloud()
            .size([width, height])
            .words(chartViewModel.parsedData())
            .rotate(function () {
                return ~~(Math.random() * 2) * 90;
            })
            .font(chartViewModel.fontFamily())
            .fontSize(function (d) {
                return d[selectedMeasure];
            })
            .on("end", drawSkillCloud)
            .start();

        function drawSkillCloud(words) {
            d3.select("#dv-chart-container")
                .append("svg")
                .attr({
                    "width": width,
                    "height": height,
                    "class": chartViewModel.theme()
                })
                .append("g")
                .attr("transform", "translate(" + ~~(width / 2) + "," + ~~(height / 2) + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", function (d) {
                    var flSize = parseFloat(d[selectedMeasure]);
                    var scaledSize = sizeScale(flSize);

                    arrSize.push(scaledSize);
                    return scaledSize + "px";
                })
                .style({
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                    "cursor": "default",
                    "font-family": chartViewModel.fontFamily()
                })
                .style("fill", function (d, i) {
                    return color(i);
                })
                .attr({
                    "text-anchor": "middle",
                    "transform": function (d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    }
                })
                .text(function (d) {
                    return d[selectedDimension];
                })
                .on("contextmenu", function (d) {
                    var event = d3.event;
                    event.preventDefault();

                    colorSource = event.target;

                    $("#context-menu").show().css({
                        top: event.pageY + "px",
                        left: event.pageX + "px"
                    });
                });
        }
    }
    else {
        Helper.showParamsWarning(["Dimension for labels.", "Measure for size."]);
    }
}

function generateBubbleChart() {
    if (chartViewModel.Hirarechya().length > 0 && chartViewModel.Labela.length > 0 && chartViewModel.Sizea.length >0) {

        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        chartViewModel.clearLegends();
        arrSize = [];

        var selectedDimensionOne = chartViewModel.Hirarechya()[0];
        var selectedDimensionTwo = chartViewModel.Labela;
        var selectedMeasureOne = chartViewModel.Sizea;

        var diameter = chartViewModel.width();
        var format = d3.format(",d");
        var color = d3.scale.category10();

        var pack = d3.layout
                    .pack()
                    .size([diameter, diameter])
                    .padding(1.5)
                    .value(function (d) { return d[selectedMeasureOne]; });

        var vis = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": diameter,
                        "height": diameter,
                        "class": chartViewModel.theme()
                    })
                    .append("g");

        var data = { name: selectedDimensionOne, children: chartViewModel.parsedData() };

        var node = vis.data([data])
                    .selectAll("circle")
                    .data(pack.nodes)
                    .enter()
                    .append("g");

        node.append("circle")
            .attr({
                "class": "node",
                "transform": function (d) { return "translate(" + d.x + "," + d.y + ")"; },
                "r": function (d) {
                    arrSize.push(d.r);
                    return d.r;
                },
                "data-legend": function (d, i) {
                    return d[selectedDimensionOne];
                },
                "class": chartViewModel.shapeIdentifier
            })
            .style({
                "fill": function (d) {
                    if (Helper.isNotEmpty(d[selectedDimensionOne])) {
                        var scaledColor = color(d[selectedDimensionOne]);

                        if (!Helper.isPresentInLegend(d[selectedDimensionOne])) {
                            chartViewModel.addLegendIcon({
                                name: d[selectedDimensionOne],
                                color: scaledColor,
                            });
                        };

                        return scaledColor;
                    }
                },
                "display": function (d) {
                    return d[selectedDimensionOne] == undefined ? "none" : "block";
                }
            })
            .on("contextmenu", function (d) {
                var event = d3.event;
                event.preventDefault();

                colorSource = event.target;

                $("#context-menu").show().css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            });

        node.append("text")
        .attr({
            "x": function (d) { return d.x; },
            "y": function (d) { return d.y + 5; },
            "text-anchor": "middle"
        })
        .text(function (d) { return d[selectedDimensionTwo]; })
        .style({
            "fill": "#000",
            "font-family": chartViewModel.fontFamily(),
            "font-size": chartViewModel.fontSize()
        });

        node.append("title")
            .text(function (d) { return d[selectedDimensionTwo] + ": " + format(d[selectedMeasureOne]); });
    }
    else {
        Helper.showParamsWarning(["Dimension for groups.", "Dimension for labels.", "Measure for size."]);
    }
}

function generateTreemap() {

    if (chartViewModel.Hirarechya().length > 0 && chartViewModel.Sizea.length > 0) {

        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        chartViewModel.clearLegends();
        arrSize = [];

        var selectedDimensionOne = chartViewModel.Hirarechya()[0];
        var selectedMeasureOne = chartViewModel.Sizea;

        var width = chartViewModel.width() - 80; //1080
        var height = chartViewModel.height() - 180; //800
        var xScale = d3.scale.linear().range([0, width]);
        var yScale = d3.scale.linear().range([0, height]);
        var color = d3.scale.category20c();
        var node;
        //var leafDimension = Helper.getLastElement(chartViewModel.Hirarechya());
        var leafDimension = chartViewModel.Labela;
        var treemap = d3.layout
                        .treemap()
                        .round(false)
                        .size([width, height])
                        .sticky(true)
                        .value(function (d) { return d[selectedMeasureOne]; });

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width,
                        "height": height,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(.5,.5)");

        var root = Helper.csvToTree(chartViewModel.parsedData(), chartViewModel.Hirarechya());

        var nodes = treemap.nodes(root)
                        .filter(function (d) { return !d.children; });

        var cell = svg.selectAll("g")
                    .data(nodes)
                    .enter()
                    .append("g")
                    .attr({
                        "class": "cell",
                        "transform": function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        },
                         //"data-legend": function(d, i) {
                         //    if (Helper.isNotEmpty(selectedDimensionOne)) {
                         //        return d[selectedDimensionOne];
                         //    }
                         //}
                    })
                    .on("click", function (d) {
                        return zoom(node == d.parent ? root : d.parent);
                    })
                    .on("contextmenu", function (d) {
                        var event = d3.event;
                        event.preventDefault();

                        colorSource = event.target;

                        $("#context-menu").show().css({
                            top: event.pageY + "px",
                            left: event.pageX + "px"
                        });
                        $(".cell").children().removeClass('Slectedc');
                        $(this).children(':first').addClass('Slectedc');
                     
                    });

        cell.append("rect")
            .attr({
                "width": function (d) { return d.dx; },
                "height": function (d) { return d.dy; }
            })
            //.style("fill", function (d) { return color(d[selectedDimensionOne]); });
        //////
        .style(
            "fill", function (d) {
                    var scaledColor = color(d[selectedDimensionOne]);
                    if (!Helper.isPresentInLegend(d[selectedDimensionOne])) {
                        chartViewModel.addLegendIcon({
                            name: d[selectedDimensionOne],
                            color: scaledColor,
                        });
                    };
                    return scaledColor;
            });
        ////
        cell.append("text")
            .attr({
                "x": function (d) { return d.dx / 2; },
                "y": function (d) { return d.dy / 2; },
                "dy": ".35em",
                "text-anchor": "middle",
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            })
            .text(function (d) {
                return d[leafDimension];
            })
            .style("opacity", function (d) {
                d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0;
            });

        function zoom(d) {
            var kx = width / d.dx, ky = height / d.dy;

            xScale.domain([d.x, d.x + d.dx]);
            yScale.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell")
                        .transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .attr("transform", function (d) {
                            return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
                        });

            t.select("rect")
                .attr({
                    "width": function (d) { return kx * d.dx; },
                    "height": function (d) { return ky * d.dy; }
                });

            t.select("text")
                .attr({
                    "x": function (d) { return kx * d.dx / 2; },
                    "y": function (d) { return ky * d.dy / 2; }
                })
                .style("opacity", function (d) { return kx * d.dx > d.w ? 1 : 0; });

            node = d;

            d3.event.stopPropagation();
        }
    }
    else {
        Helper.showParamsWarning(["Dimension for groups.", "Dimension for labels.", "Measure for size."]);
    }
}

function generateForceDirectedGraph() {

    if (chartViewModel.Hirarechya().length > 1) {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var selectedDimensionOne = chartViewModel.Hirarechya()[0];
        var selectedDimensionTwo = chartViewModel.Hirarechya()[1];

        var nodes = {};

        chartViewModel.parsedData().forEach(function (link) {
            link.source = nodes[link[selectedDimensionOne]] || (nodes[link[selectedDimensionOne]] = { name: link[selectedDimensionOne] });
            link.target = nodes[link[selectedDimensionTwo]] || (nodes[link[selectedDimensionTwo]] = { name: link[selectedDimensionTwo] });
        });


        var width = chartViewModel.width();
        var height = chartViewModel.height();

        var force = d3.layout
                        .force()
                        .nodes(d3.values(nodes))
                        .links(chartViewModel.parsedData())
                        .size([width, height])
                        .linkDistance(60)
                        .charge(-100)
                        .on("tick", tick)
                        .start();

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width,
                        "height": height,
                        "class": chartViewModel.theme()
                    });

        var link = svg.selectAll(".link")
                        .data(force.links())
                        .enter()
                        .append("line")
                        .attr("class", "link")
                        .style({
                            "fill": "none",
                            "stroke": "#666",
                            "stroke-width": "1.5px"
                        });

        var node = svg.selectAll(".node")
                        .data(force.nodes())
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout)
                        .call(force.drag)
                        .style({
                            "fill": "#ccc",
                        });

        node.append("circle")
            .attr("r", 8)
            .on("contextmenu", function (d) {
                var event = d3.event;
                event.preventDefault();

                colorSource = event.target;

                $("#context-menu").show().css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            });

        node.append("text")
            .attr({
                "x": 12,
                "dy": ".35em"

            })
            .text(function (d) { return d.name; })
            .style({
                "font-size": chartViewModel.fontSize(),
                "font-family": chartViewModel.fontFamily(),
                "pointer-events": "none",
                "fill": "#000"
            });

        function tick() {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
        }

        function mouseover() {
            d3.select(this)
                .select("circle")
                .transition()
                .duration(500)
                .attr("r", 16);
        }

        function mouseout() {
            d3.select(this)
                .select("circle")
                .transition()
                .duration(500)
                .attr("r", 8);
        }
    }
    else {
        Helper.showParamsWarning(["Dimension for groups.", "Dimension for labels."]);
    }
}

function generateSunburstPartition() {

    var dimensions = chartViewModel.Hirarechya();
    var measures = chartViewModel.Sizea;
    var parsedData = chartViewModel.parsedData();

    if (dimensions.length > 0 && measures.length > 0) {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var selectedMeasure = measures;

        var width = chartViewModel.width();//960
        var height = chartViewModel.height();//700
        var radius = Math.min(width, height) / 2;

        var xScale = d3.scale
                    .linear()
                    .range([0, 2 * Math.PI]);

        var yScale = d3.scale
                    .linear()
                    .range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width,
                        "height": height,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        var root = Helper.csvToTree(parsedData, dimensions);

        var partition = d3.layout
                            .partition()
                            .value(function (d) { return  + d[selectedMeasure]; });
        var arc = d3.svg
                    .arc()
                    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x))); })
                    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x + d.dx))); })
                    .innerRadius(function (d) { return Math.max(0, yScale(d.y)); })
                    .outerRadius(function (d) { return Math.max(0, yScale(d.y + d.dy)); });

        var g = svg.selectAll("g")
                    .data(partition
                    .nodes(root))
                    .enter()
                    .append("g");

        var path = g.append("path")
                        .attr("d", arc)
                        .style("fill", function (d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click);

        var text = g.append("text")
                        .attr({
                            "transform": function (d) { return "rotate(" + computeTextRotation(d) + ")"; },
                            "x": function (d) { return yScale(d.y); },
                            "dx": "6",
                            "dy": ".35em",
                        })
                        .text(function (d) {
                            return d.name;
                        })
                        .style({
                            "font-family": chartViewModel.fontFamily(),
                            "font-size": chartViewModel.fontSize(),
                        });

        function click(d) {

            text.transition().attr("opacity", 0);

            path.transition()
                .duration(750)
                .attrTween("d", arcTween(d))
                .each("end", function (e, i) {
                    if (e.x >= d.x && e.x < (d.x + d.dx)) {
                        var arcText = d3.select(this.parentNode).select("text");

                        arcText.transition().duration(750)
                        .attr({
                            "opacity": 1,
                            "transform": function () { return "rotate(" + computeTextRotation(e) + ")" },
                            "x": function (d) { return yScale(d.y); }
                        });
                    }
                });
        }

        d3.select(self.frameElement).style("height", height + "px");

        function arcTween(d) {
            var xd = d3.interpolate(xScale.domain(), [d.x, d.x + d.dx]);
            var yd = d3.interpolate(yScale.domain(), [d.y, 1]);
            var yr = d3.interpolate(yScale.range(), [d.y ? 20 : 0, radius]);

            return function (d, i) {
                return i
                    ? function (t) { return arc(d); }
                    : function (t) { xScale.domain(xd(t)); yScale.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }

        function computeTextRotation(d) {
            return (xScale(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        }
    }
    else {
        Helper.showParamsWarning(["One or more dimensions for hierarchy.", "Measure for size."]);
    }
}

function generateSankeyDiagram() {

    var dimensions = chartViewModel.Hirarechya().slice();
    var measures = chartViewModel.Sizea;
    var parsedData = chartViewModel.parsedData().slice();

    if (dimensions.length > 1 && measures.length > 0) {

        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var selectedDimensionOne = dimensions[0];
        var selectedDimensionTwo = dimensions[1];
        var selectedMeasureOne = measures;

        var units = selectedMeasureOne.toString();

        var margin = { top: 10, right: 10, bottom: 10, left: 10 };
        var width = chartViewModel.width() - margin.left - margin.right;
        var height = chartViewModel.height() - margin.top - margin.bottom;

        var formatNumber = d3.format(",.0f");
        var format = function (d) { return formatNumber(d) + " " + units; };
        var color = d3.scale.category20();

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width + margin.left + margin.right,
                        "height": height + margin.top + margin.bottom,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sankey = d3.sankey()
                        .nodeWidth(36)
                        .nodePadding(10)
                        .size([width, height]);

        var path = sankey.link();

        var graph = { "nodes": [], "links": [] };

        parsedData.forEach(function (d) {
            graph.nodes.push({ "name": d[selectedDimensionOne] });
            graph.nodes.push({ "name": d[selectedDimensionTwo] });

            graph.links.push({ "source": d[selectedDimensionOne], "target": d[selectedDimensionTwo], "value": +d[selectedMeasureOne] });
        });

        graph.nodes = d3.keys(d3.nest()
                            .key(function (d) { return d.name; })
                            .map(graph.nodes));

        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });

        graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = { "name": d };
        });

        sankey.nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        var link = svg.append("g")
                        .selectAll(".link")
                        .data(graph.links)
                        .enter()
                        .append("path")
                        .attr({
                            "class": "link",
                            "d": path
                        })
                        .style({
                            "stroke-width": function (d) { return Math.max(1, d.dy); },
                            "fill": "none",
                            "stroke": "#000",
                            "stroke-opacity": ".2"
                        })
                        .sort(function (a, b) { return b.dy - a.dy; })
                        .on("mouseover", function () {
                            d3.select(this).style("stroke-opacity", "0.5");
                        })
                        .on("mouseleave", function () {
                            d3.select(this).style("stroke-opacity", "0.2");
                        });

        link.append("title")
            .text(function (d) {
                return d.source.name + " → " +
                        d.target.name + "\n" + format(d.value);
            });

        var node = svg.append("g")
                    .selectAll(".node")
                    .data(graph.nodes)
                    .enter()
                    .append("g")
                    .attr({
                        "class": "node",
                        "transform": function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        }
                    })
                    .call(d3.behavior
                            .drag()
                            .origin(function (d) { return d; })
                            .on("dragstart", function () {
                                this.parentNode.appendChild(this);
                            })
                            .on("drag", dragmove));

        node.append("rect")
            .attr({
                "height": function (d) { return d.dy; },
                "width": sankey.nodeWidth()
            })
            .style({
                "fill": function (d) {
                    return d.color = color(d.name.replace(/ .*/, ""));
                },
                "stroke": function (d) {
                    return d3.rgb(d.color).darker(2);
                },
                "cursor": "move",
                "fill-opacity": "9",
                "shape-rendering": "crispEdges"
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            })
            .style({
                "pointer-events": "none",
                "text-shadow": "0 1px 0 #fff",
            });

        node.append("text")
            .attr({
                "x": -6,
                "y": function (d) { return d.dy / 2; },
                "dy": ".35em",
                "text-anchor": "end",
                "transform": null
            })
            .text(function (d) { return d.name; })
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            })
            .filter(function (d) { return d.x < width / 2; })
            .attr({
                "x": 6 + sankey.nodeWidth(),
                "text-anchor": "start"
            });

        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                        d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                    ) + "," + (
                            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                    ) + ")");

            sankey.relayout();

            link.attr("d", path);
        }
    }
    else {
        Helper.showParamsWarning(["Dimension for groups.", "Dimension for labels.", "Measure for size."]);
    }
}

function generateHeatmap() {

    var measures = chartViewModel.Xaxsisa;
    var parsedData = chartViewModel.parsedData().slice();

    if (measures.length > 0) {

        Helper.clearSvgContainer();

        Helper.focusSvgContainer();

        var selectedMeasureOne = measures;
        var selectedMeasureTwo = chartViewModel.Yaxsisa;
        var selectedMeasureThree = chartViewModel.Sizea;

        var margin = { top: 50, right: 0, bottom: 100, left: 30 };
        var width = chartViewModel.width() - margin.left - margin.right; //960
        var height = chartViewModel.height() - margin.top - margin.bottom; //430
        var gridSize = Math.floor(width / 24);
        var legendElementWidth = gridSize * 2;
        var buckets = 9;

        var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
        var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        var times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "id": "myCanvas",
                        "width": width + margin.left + margin.right,
                        "height": height + margin.top + margin.bottom,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg
                        .selectAll(".dayLabel")
                        .data(days)
                        .enter()
                        .append("text")
                        .text(function (d) { return d; })
                        .attr({
                            "x": 0,
                            "y": function (d, i) { return i * gridSize; }
                        })
                        .style({
                            "text-anchor": "end",
                            "font-family": chartViewModel.fontFamily(),
                            "font-size": chartViewModel.fontSize()
                        })
                        .attr({
                            "transform": "translate(-6," + gridSize / 1.5 + ")",
                            "class": function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); }
                        });

        var timeLabels = svg.selectAll(".timeLabel")
                            .data(times)
                            .enter()
                            .append("text")
                            .text(function (d) { return d; })
                            .attr({
                                "x": function (d, i) { return i * gridSize; },
                                "y": 0
                            })
                            .style({
                                "text-anchor": "middle",
                                "font-family": chartViewModel.fontFamily(),
                                "font-size": chartViewModel.fontSize()
                            })
                            .attr({
                                "transform": "translate(" + gridSize / 2 + ", -6)",
                                "class": function (d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); }
                            });
        draw(parsedData);

        function draw(data) {

            var colorScale = d3.scale
                                .quantile()
                                .domain([0, buckets - 1, d3.max(data, function (d) { return Number(d[selectedMeasureThree]); })])
                                .range(colors);

            var cards = svg.selectAll(".hour")
                            .data(data, function (d) { return d[selectedMeasureOne] + ':' + d[selectedMeasureTwo]; });

            cards.append("title");

            cards.enter()
                .append("rect")
                .attr({
                    "x": function (d) {
                        return (Number(d[selectedMeasureTwo]) - 1) * gridSize;
                    },
                    "y": function (d) { return (Number(d[selectedMeasureOne]) - 1) * gridSize; },
                    "rx": 4,
                    "ry": 4,
                    "class": "hour bordered",
                    "width": gridSize,
                    "height": gridSize
                })
                .style("fill", colors[0]);

            cards.transition()
                .duration(2000)
                .style("fill", function (d) { return colorScale(Number(d[selectedMeasureThree])); });

            cards.select("title").text(function (d) { return d[selectedMeasureThree]; });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                            .data([0]
                            .concat(colorScale.quantiles()), function (d) { return d; });

            legend.enter()
                    .append("g")
                    .attr("class", "legend");

            legend.append("rect")
                    .attr({
                        "x": function (d, i) { return legendElementWidth * i; },
                        "y": height,
                        "width": legendElementWidth,
                        "height": gridSize / 2
                    })
                    .style("fill", function (d, i) { return colors[i]; });

            legend.append("text")
                    .attr("class", "mono")
                    .text(function (d) { return "≥ " + Math.round(d); })
                    .attr({
                        "x": function (d, i) { return legendElementWidth * i; },
                        "y": height + gridSize
                    })
                    .style({
                        "font-family": chartViewModel.fontFamily(),
                        "font-size": chartViewModel.fontSize()
                    });

            legend.exit().remove();
        };
    }
    else {
        Helper.showParamsWarning(["3 Measures."]);
    }
}

function generateRadarChart() {

    var dimensions = chartViewModel.Hirarechya()[0];
    var measures = chartViewModel.Sizea;
    var parsedData = chartViewModel.parsedData();

    if (dimensions.length > 0 && measures.length > 0) {

        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var selectedDimensionOne = dimensions;
        var selectedDimensionTwo = chartViewModel.Labela;
        var selectedMeasure = measures;

        var formattedData = [];
        var dataToDraw = [];

        parsedData.forEach(function (item, index) {

            var isPresent = false;
            var position = -1;

            for (var i = 0; i < formattedData.length; i++) {

                if (formattedData[i].group == item[selectedDimensionOne]) {
                    position = i;
                    isPresent = true;
                    break;
                }
            }

            if (isPresent) {
                formattedData[position].vals.push({ axis: item[selectedDimensionTwo], value: item[selectedMeasure] })
            }
            else {
                formattedData.push({
                    group: item[selectedDimensionOne],
                    vals: [{ axis: item[selectedDimensionTwo], value: item[selectedMeasure] }]
                });
            }
        });

        for (var i = 0; i < formattedData.length; i++) {
            dataToDraw.push(formattedData[i].vals);
        }

        var width = chartViewModel.width();
        var height = chartViewModel.height();

        var margin = { top: 100, right: 100, bottom: 100, left: 100 };
        var width = chartViewModel.width() - margin.left - margin.right;

        var radarChartOptions = {
            w: width,
            h: width,
            margin: margin,
            maxValue: 0.5,
            levels: 5,
            roundStrokes: true,
        };

        RadarChart("#dv-chart-container", dataToDraw, radarChartOptions);
    }
    else {
        Helper.showParamsWarning(["Dimension for groups.", "Dimension for axis.", "Measure for values."]);
    }
    
}

function generateTilfordTree() {

    var dimensions = chartViewModel.Hirarechya().slice();
    var parsedData = chartViewModel.parsedData().slice();

    if (dimensions.length > 0) {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var diameter = chartViewModel.width(); //950

        var tree = d3.layout
                    .tree()
                    .size([360, diameter / 2 - 120])
                    .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg
                        .diagonal
                        .radial()
                        .projection(function (d) { return [d.y, d.x / 180 * Math.PI]; });

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": diameter,
                        "height": diameter - 150,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + diameter / 2 + "," + ((diameter / 2) - 100) + ")");

        var root = Helper.csvToTree(parsedData, dimensions);

        var nodes = tree.nodes(root);

        var links = tree.links(nodes);

        var link = svg.selectAll(".tilford-link")
                        .data(links)
                        .enter()
                        .append("path")
                        .attr({
                            "class": "tilford-link",
                            "d": diagonal
                        });

        var node = svg.selectAll(".tilford-node")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr({
                            "class": "tilford-node",
                            "transform": function (d) {
                                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                            }
                        });

        node.append("circle")
            .attr("r", 4)
            .on("contextmenu", function (d) {
                var event = d3.event;
                event.preventDefault();

                colorSource = event.target;

                $("#context-menu").show().css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            });

        node.append("text")
            .attr({
                "dy": ".31em",
                "text-anchor": function (d) {
                    return d.x < 180 ? "start" : "end";
                },
                "transform": function (d) {
                    return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
                }
            })
            .text(function (d) {
                return d.name;
            })
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        d3.select(self.frameElement).style("height", diameter - 150 + "px");
    }
    else {
        Helper.showParamsWarning(["Atleast one dimension for hierarchy."])
    }
}

function generateCollapsibleTree() {

    //var dimensions = chartViewModel.lstDimensions();

    if (chartViewModel.Hirarechya().length > 1) {
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

        var dimensions = chartViewModel.Hirarechya().slice();
        var inputData = chartViewModel.inputData().slice();
        var parsedData = chartViewModel.parsedData().slice();
        var selectedDimensionOne = dimensions[0];
        var selectedDimensionTwo = dimensions[1];
        var firstLine = inputData.split('\n')[0];
        var isCsv = Helper.containsSubstring(firstLine, ",");

        var childCats = [];
        var baseCats = [];
        var startNode = {};
        for (var i = 0; i < parsedData.length; i++) {

            var isNotPresent = baseCats.indexOf(parsedData[i][selectedDimensionOne]) < 0;
            var isNotChild = childCats.indexOf(parsedData[i][selectedDimensionOne]) < 0;

            if (isNotPresent && isNotChild) {
                baseCats.push(parsedData[i][selectedDimensionOne]);
            }
        }

        for (var i = 0; i < parsedData.length; i++) {

            var isNotPresent = childCats.indexOf(parsedData[i][selectedDimensionTwo]) < 0;
            if (isNotPresent) {
                childCats.push(parsedData[i][selectedDimensionTwo]);
            }
        }

        for (var i = 0; i < baseCats.length; i++) {

            var tempObj = {};

            tempObj[selectedDimensionOne] = "";
            tempObj[selectedDimensionTwo] = baseCats[i];

            parsedData.push(tempObj);
        };

        startNode[selectedDimensionOne] = null;
        startNode[selectedDimensionTwo] = "";

        parsedData.push(startNode);

        var margin = { top: 20, right: 120, bottom: 20, left: 120 };
        var width = chartViewModel.width() - margin.right - margin.left;
        var height = chartViewModel.height() - margin.top - margin.bottom;

        var i = 0;
        var duration = 500;
        var root;

        var tree = d3.layout
                .tree()
                .size([height, width]);

        var diagonal = d3.svg
                        .diagonal()
                        .projection(function (d) { return [d.y, d.x]; });

        var svg = d3.select("#dv-chart-container")
                    .append("svg")
                    .attr({
                        "width": width + margin.right + margin.left,
                        "height": height + margin.top + margin.bottom,
                        "class": chartViewModel.theme()
                    })
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = parsedData;

        var rad = 5;

        var dataMap = data.reduce(function (map, node) {
            map[node[selectedDimensionTwo]] = node;
            return map;
        }, {});

        var treeData = [];

        data.forEach(function (node) {
            var parent = dataMap[node[selectedDimensionOne]];

            if (parent) {
                (parent.children || (parent.children = [])).push(node);
            }
            else {
                treeData.push(node);
            }
        });

        root = treeData[0];

        root.x0 = height / 2;
        root.y0 = 0;

        update(root);

        function update(source) {

            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            nodes.forEach(function (d) { d.y = d.depth * 180; });

            var node = svg.selectAll("g.node")
                        //.data(nodes, function (d) { return d.id || (d.id = ++i); });
                            .data(nodes, function (d) { return (d.id = ++i); });
            var nodeEnter = node.enter()
                                .append("g")
                                .attr({
                                    "class": "node",
                                    "transform": function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; }
                                })
                                .on("click", click);

            nodeEnter.append("circle")
                    .attr("r", rad)
                    .style({
                        "fill": function (d) { return d._children ? "lightsteelblue" : "#fff"; },
                        "stroke": "steelblue",
                        "stroke-width": "2px",
                        "cursor": "pointer"
                    });

            nodeEnter.append("text")
                    .attr({
                        "x": function (d) { return d.children || d._children ? -13 : 13; },
                        "dy": ".35em",
                        "text-anchor": function (d) { return d.children || d._children ? "end" : "start"; }
                    })
                    .text(function (d) { return d[selectedDimensionTwo]; })
                    .style({
                        "fill-opacity": 1e-6,
                        "font-family": chartViewModel.fontFamily(),
                        "font-size": chartViewModel.fontSize()
                    });

            var nodeUpdate = node.transition()
                                .duration(duration)
                                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                        .attr("r", rad)
                        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                        .style("fill-opacity", 1);

            var nodeExit = node.exit()
                                .transition()
                                .duration(duration)
                                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                                .remove();

            nodeExit.select("circle")
                    .attr("r", rad);

            nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

            var link = svg.selectAll("path.link")
                        .data(links, function (d) { return d.target.id; });

            link.enter()
                .insert("path", "g")
                .attr({
                    "d": function (d) {
                        var o = { x: source.x0, y: source.y0 };
                        return diagonal({ source: o, target: o });
                    },
                    "class": "link"
                })
                .style({
                    "fill": "none",
                    "stroke": "#ccc",
                    "stroke-width": "2px",
                });

            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            link.exit()
                .transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function updateonclick(source) {

            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            nodes.forEach(function (d) { d.y = d.depth * 180; });

            var node = svg.selectAll("g.node")
                        .data(nodes, function (d) { return d.id || (d.id = ++i); });
                            //.data(nodes, function (d) { return (d.id = ++i); });
            var nodeEnter = node.enter()
                                .append("g")
                                .attr({
                                    "class": "node",
                                    "transform": function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; }
                                })
                                .on("click", click);

            nodeEnter.append("circle")
                    .attr("r", rad)
                    .style({
                        "fill": function (d) { return d._children ? "lightsteelblue" : "#fff"; },
                        "stroke": "steelblue",
                        "stroke-width": "2px",
                        "cursor": "pointer"
                    });

            nodeEnter.append("text")
                    .attr({
                        "x": function (d) { return d.children || d._children ? -13 : 13; },
                        "dy": ".35em",
                        "text-anchor": function (d) { return d.children || d._children ? "end" : "start"; }
                    })
                    .text(function (d) { return d[selectedDimensionTwo]; })
                    .style({
                        "fill-opacity": 1e-6,
                        "font-family": chartViewModel.fontFamily(),
                        "font-size": chartViewModel.fontSize()
                    });

            var nodeUpdate = node.transition()
                                .duration(duration)
                                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                        .attr("r", rad)
                        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                        .style("fill-opacity", 1);

            var nodeExit = node.exit()
                                .transition()
                                .duration(duration)
                                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                                .remove();

            nodeExit.select("circle")
                    .attr("r", rad);

            nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

            var link = svg.selectAll("path.link")
                        .data(links, function (d) { return d.target.id; });

            link.enter()
                .insert("path", "g")
                .attr({
                    "d": function (d) {
                        var o = { x: source.x0, y: source.y0 };
                        return diagonal({ source: o, target: o });
                    },
                    "class": "link"
                })
                .style({
                    "fill": "none",
                    "stroke": "#ccc",
                    "stroke-width": "2px",
                });

            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            link.exit()
                .transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            updateonclick(d);
            //update(d);
        }
    }
    else {
        Helper.showParamsWarning(["This Graph needs more than one hirarchy Attributes at [1]."]);
    }
}

function generateMotionPlot() {

    //var measures = chartViewModel.lstMeasures();
    //var dimensions = chartViewModel.lstDimensions();
    var parsedData = chartViewModel.parsedData();
    var selectedDimensionOne = chartViewModel.Labela;
    var selectedDimensionTwo = chartViewModel.Hirarechya()[0];
    var selectedMeasureOne = chartViewModel.Yaxsisa;
    var selectedMeasureTwo = chartViewModel.Xaxsisa;
    var selectedMeasureThree = chartViewModel.Sizea;

    if(selectedDimensionOne.length > 0 && selectedDimensionTwo.length >0){
        Helper.clearSvgContainer();
        Helper.focusSvgContainer();

     
        var margin = { top: 20, right: 40, bottom: 30, left: 20 };

        var height = chartViewModel.height() - margin.top - margin.bottom; //400
        var width = chartViewModel.width() - margin.left - margin.right;  //800
        var totalWidth = width + margin.right + margin.left;
        var maxBubbleSize = 50;
        var totalHeight = height + margin.top + margin.bottom;
        var xLabelWidth = 0;
        var yLabelWidth = 0;
        var longest = 0;
        var dates = new Array();
        var labels = new Array();
        var uniqueCircles = new Array();
        var dataPoints;

        var xScale = d3.scale.linear()
                      .domain([0, d3.max(parsedData, function (d) {

                          var strNumber = d[selectedMeasureOne];

                          if (strNumber.length > longest) {
                              longest = strNumber.length;
                          }

                          return parseInt(strNumber);
                      })])
                      .range([0, width]);

        var yScale = d3.scale.linear()
    	                .domain([0, d3.max(parsedData, function (d) {
    	                    var strNumber = d[selectedMeasureTwo];

    	                    return parseInt(strNumber);
    	                })])
    	                .range([height, 0]);

        var sizeScale = d3.scale.linear()
                        .domain([1, d3.max(parsedData, function (d) {
                            var strSize = d[selectedMeasureThree];
                            return parseInt(strSize);
                        })])
    	                .range([3, maxBubbleSize]);

        var xAxis = d3.svg
                        .axis()
                        .scale(xScale)
                        .orient('bottom');

        var yAxis = d3.svg
                        .axis()
                        .scale(yScale)
                        .orient('left');

        parsedData.map(function (d) {
            var currentLabel = d[selectedDimensionOne];
            var currentDate = d[selectedDimensionTwo];

            if (labels.indexOf(currentLabel) < 0) {
                uniqueCircles.push({
                    x: d[selectedMeasureOne],
                    y: d[selectedMeasureTwo],
                    label: d[selectedDimensionOne],
                    size: d[selectedMeasureThree]
                });

                labels.push(currentLabel);
            }
            if (dates.indexOf(currentDate) < 0) {
                dates.push(currentDate);
            }
        });

        dataPoints = Helper.create2DArray(labels.length);

        parsedData.map(function (d) {
            var currentLabel = d[selectedDimensionOne];
            var labelIndex = labels.indexOf(currentLabel);

            dataPoints[labelIndex].push({
                date: d[selectedDimensionTwo],
                x: d[selectedMeasureOne],
                y: d[selectedMeasureTwo]
            });
        });

        var svg = d3.select("#dv-chart-container")
                       .append('svg')
                       .attr({
                           'width': totalWidth,
                           'height': totalHeight,
                           "class": chartViewModel.theme()
                       })
                       .append("g")
                       .attr("id", "g-main");

        d3.select("svg")
                       .append("text")
                       .attr("text-anchor", "end")
                       .attr("x", totalWidth)
                       .attr("y", totalHeight - 3)
                       .text(selectedMeasureTwo);

        d3.select("svg")
            .append("text")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(selectedMeasureOne);

        svg.selectAll("text")
           .data(yScale.ticks())
           .enter()
           .append("text")
           .text(function (d) {
               return yScale.tickFormat()(d);
           })
           .each(function (d) {
               yLabelWidth = Math.max(this.getBBox().width + yAxis.tickSize() + yAxis.tickPadding(), yLabelWidth);
           })
           .remove();

        svg.attr({
            "transform": "translate(" + Math.max(0, yLabelWidth) + ", 0)",
        });

        xLabelWidth = ((totalWidth / 100) * longest) * 1.5;

        d3.select("svg").attr({
            "width": totalWidth + yLabelWidth,
            "height": totalHeight + xLabelWidth,
        });

        svg.append('g')
            .attr({
                'transform': 'translate(' + (yLabelWidth + 10) + ',' + (height + xLabelWidth) + ')',
                'class': 'scatter-axis'
            })
            .call(xAxis)
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        svg.append('g')
            .attr({
                'transform': 'translate(' + (yLabelWidth + 10) + ',' + xLabelWidth + ')',
                'class': 'scatter-axis'
            })
            .call(yAxis)
            .style({
                "font-family": chartViewModel.fontFamily(),
                "font-size": chartViewModel.fontSize()
            });

        svg.selectAll(".scatter-circle")
            .data(uniqueCircles)
            .enter()
            .append("circle")
            .attr({
                "cx": function (d, i) {
                    return xScale(d.x) + yLabelWidth;
                },
                "cy": function (d, i) {
                    return yScale(d.y) + xLabelWidth;
                },
                "r": function (d, i) {
                    return sizeScale(d.size);
                },
                "class": "scatter-circle",
                "data-label": function (d, i) {
                    return d[selectedDimensionOne];
                }
            })
            .style({
                "fill": "royalblue",
                "opacity": "0.7"
            })
            .on('mouseover', function (d) {
                //show tooltip
            })
            .on('mouseout', function (d) {
                //hide tooltip
            })
            .on('contextmenu', function () {
                event.preventDefault();

                colorSource = event.target;

                $("#context-menu").show().
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            });

        var dateScroll = d3.select("#dv-chart-container")
                            .append("div")
                            .attr("class", "text-left");


        dateScroll.append("h1")
            .attr("id", "lblSelectedDate")
            .text(dates[0])
            .style({
                "font-size": "100px",
                "font-weight": "100",
                "color": "#aaa",
                "text-align": "center",
                "margin": "0",
            });

        dateScroll.append("div")
            .attr({
                "class": "col-md-offset-5 col-md-2",
                "id": "dv-date-slider"
            });

        $("#dv-date-slider").slider({
            min: 0,
            max: dates.length - 1,
            slide: function (event, ui) {
                var index = ui.value;
                var sliderDate = dates[index];

                $("#lblSelectedDate").text(sliderDate);

                $("circle").each(function () {
                    var thisLabel = $(this).attr("data-label");
                    var index = labels.indexOf(thisLabel);
                    var labelPoints = dataPoints[index];
                    var nextX, nextY;

                    for (var i = 0; i < labelPoints.length; i++) {
                        if (labelPoints[i].date == sliderDate) {
                            nextX = labelPoints[i].x,
                            nextY = labelPoints[i].y
                        }
                    }

                    d3.select(this)
                        .transition()
                        .duration("1000")
                        .attr({
                            "cx": xScale(nextX) + yLabelWidth,
                            "cy": yScale(nextY) + xLabelWidth
                        });
                });
            }
        });

        $("svg").attr("height", totalHeight + maxBubbleSize);
        $("#g-main").attr("transform", 'translate(' + xLabelWidth + ', ' + maxBubbleSize + ')');
    }
    else {
        Helper.showParamsWarning(["Dimension for label.", "Dimension of date.", "Measure for X-Axis.", "Measure for Y-Axis.", "Measure for size."]);
    }
}