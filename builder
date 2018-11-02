    function getAttrs(DOMelement) {
        var obj = {};
        $.each(DOMelement.attributes, function () {
            if (this.specified) {
                obj[this.name] = this.value;
            }
        });
        return obj;
    }
    var vanco = 100;
var outOptions = '';


    function check_type(element_type, jsonns) {
        vanco += 1;
        var outType;
        var data_type;
        var fb = '';
        var v;
        var id = '';
        var placeholder;
        var readonly;
        var min,max, label, value, required;

        if (jsonns === 1) {
            data_type = element_type.attr('data-type');
            id = 'v'+vanco;
            if((data_type==='paragraph')||(data_type==='header')){
                fb = field_label.replace(/field_repIIDD/g, id).replace(/Text Field/g, data_type);
            }else{
                fb = field_label.replace(/repIIDD/g, id).replace(/Text Field/g, data_type);
            }

            v = field_actions.replace(/vanco/g, id).replace(/data_type/g, "'"+data_type+"'");
            placeholder = '';
            readonly = '';
            min = '';
            max = '';
            label =data_type;
            value = '';
            required = '';
        } else {
            id = element_type.name;
            data_type = element_type.type;
            if((data_type==='paragraph')||(data_type==='header')){
                fb = field_label.replace(/field_repIIDD/g, id).replace(/Text Field/g, element_type.label);
            }else{
                fb = field_label.replace(/repIIDD/g, id).replace(/Text Field/g, element_type.label);
            }
            placeholder = element_type.placeholder;
            readonly = element_type.readonly;
            min = element_type.min;
            max = element_type.max;
            label = element_type.label;
            value = element_type.value;
            required = element_type.required;
            v='';
            if (jsonns===3){
                v = field_actions.replace(/vanco/g, id).replace(/data_type/g, "'"+data_type+"'");
            }


        }
            if ((data_type === 'text'|| data_type === 'date' || data_type === 'number' || data_type === 'currency' || data_type === 'percentage' || data_type === 'range')) {
                if(data_type === 'currency'){ currency = '<span class="input-group-addon">&#8373;</span>'; money = 'class="input-group"' }
                else if (data_type === 'percentage'){ currency = '<span class="input-group-addon">%</span>'; money = 'class="input-group"' }
                else { currency = ''; money = '';}
                outType = '<div '+ money + ' class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb+ v+'<br>';
                outType +=currency;
                outType += '<input ' + required + ' min="' + min + '" max="' + max + '" type="' + data_type + '" ' + readonly + ' class="form-control formzone" placeholder="' + placeholder.replace(/~~/g,'\n') + '" name="' + id + '" id="' + id + '"  value="' + value.replace(/~~/g,'\n') + '"></div>';
            } else if (data_type === 'textarea') {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb+ v+'<br>';
                outType += '<textarea ' + required + ' type="textarea" ' + readonly + 'data-max ="' + max + '" class="form-control formzone" name="' + id + '" placeholder="' + placeholder.replace(/~~/g,'\n') + '" id="' + id + '">' + value.replace(/~~/g,'\n') + '</textarea></div>';
            }
            else if (data_type === 'select') {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb + v+'<br>';
                outType += '<select class="form-control" ' + readonly + ' name="' + id + '" id="' + id + '">';

                if (jsonns === 1) {
                    outType += '<option selected="true" value="option-1" id="select-1528713131180-preview-0">Option 1</option><option value="option-2" id="select-1528713131180-preview-1">Option 2</option><option value="option-3" id="select-1528713131180-preview-2">Option 3</option>'
                } else {
                    for (var x in element_type.value) {
                        if (element_type.value[x].selected) {
                            selected = 'selected';
                        } else {
                            selected = '';
                        }
                        outType += '<option ' + selected + ' value="' + element_type.value[x].value + '" id="select-1495730467685-preview-0">' + element_type.value[x].label + '</option>';
                    }

                }
                outType += '</select></div></div><br>';
            }
            else if (data_type === 'checkbox') {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb+ v+'<br>' +
                    '<div id="' + id + '">';

                if (jsonns === 1) {
                    outType += '<div class="checkbox"><label><input type="checkbox" value="Option 1" id="check-1528713131180-preview-0" name="' + id + '[]"' + ' >Option 1</label></div><div class="checkbox"><label><input type="checkbox" value="Option 2" id="check-1528713131180-preview-0" name="' + id + '[]"' + ' >Option 2</label></div><div class="checkbox"><label><input type="checkbox" value="Option 3" id="check-1528713131180-preview-0" name="' + id + '[]"' + ' >Option 3</label></div>';
                } else {
                    for (var x in element_type.value) {
                        if (element_type.value[x].selected) {
                            selected = 'checked';
                        } else {
                            selected = '';
                        }

                        outType += '<div class="checkbox"><label><input type="checkbox" ' + selected + ' ' + readonly + ' value="' + element_type.value[x].value + '" id="' + id + '" name="' + id + '[]"' + ' >' + element_type.value[x].label + '</label></div>';

                    }
                }
                outType += '</div></div>'

        }else if (data_type === 'radio') {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb+ v+'<br>' +
                    '<div id="' + id + '">';

                if (jsonns === 1) {
                    outType += '<div class="radio"><label><input type="radio" value="Option 1" id="check-1528713131180-preview-0" name="' + id + '"' + ' >Option 1</label></div><div class="radio"><label><input type="radio" value="Option 2" id="check-1528713131180-preview-0" name="' + id + '"' + ' >Option 2</label></div><div class="radio"><label><input type="radio" value="Option 3" id="check-1528713131180-preview-0" name="' + id + '"' + ' >Option 3</label></div>';
                } else {
                    for (var x in element_type.value) {
                        if (element_type.value[x].selected) {
                            selected = 'checked';
                        } else {
                            selected = '';
                        }

                        outType += '<div class="radio"><label><input required type="radio" ' + selected + ' ' + readonly + ' value="' + element_type.value[x].value + '" id="' + id + '" name="' + id + '"' + ' >' + element_type.value[x].label + '</label></div>';

                    }
                }
                outType += '</div></div>'

            }
            else if ((data_type === 'paragraph')) {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb.replace(/label/g, 'p') + v +'<br><br><br></div>';
            } else if ((data_type === 'header')) {
                outType = '<div class="main-form" data-type="'+data_type+'" id="main' + id + '">' + fb.replace(/label/g, 'h3') + v +'<br><br><br></div>';
            } else if ((data_type === 'table')) {
                outType = '<div data-type="'+data_type+'" class="panel panel-default main-form" id="main' + id + '">' + fb.replace(/label/g, 'h4').replace(/repIIDD/g, id).replace(/fb-repType-Label/g,'panel-body') + v + '';



                if (jsonns === 1) {
                    outType += create_table(4, 3, id);
                }else{
                    outType += create_table(element_type.rows.length, element_type.columns.length, id,element_type.rows,element_type.columns,element_type.value);
                }
                outType += '</div>'
            }



        return outType
    }
    var tableRow ='';
    var tableCol ='';
    var tableRowCount ='';
    var tableColCount ='';
    function create_table(rows,cols,iid,roows,cools,values){
        var codeblock = '<table class="table table-hover table-striped" id="'+iid+'"><thead>';
        var rowClass = '</thead>';
        var codeblockR = '';
        var codeblockC = '';
        var disabled = 'disabled';
        var disabled1 = 'disabled';
        if(typeof roows === "undefined") {
            var roows= [];
            var cools= [];
            roows.push({"name":"option 1"},{"name":"option 2"},{"name":"option 3"},{"name":"option 4"});
            cools.push({"name":"option 1","value":"option-1"},{"name":"option 2","value":"option-2"},{"name":"option 3","value":"option-3"},{"name":"option 4","value":"option-4"});
        }
        tableRowCount =roows.length;
        tableColCount =cools.length;

         for(var k = 0; k < roows.length; k++) {
         codeblockR += '<input type="text" '+disabled+' class="option-label" value="'+roows[k]["name"]+'" name="select-optionR" placeholder="Label"><br>';
             if (k === 0){
                 disabled = '';
             }
         }
         for(var k = 0; k < cools.length; k++) {
         codeblockC += '<input type="text" '+disabled1+' class="option-label" value="'+cools[k]["name"]+'" name="select-optionC" placeholder="Label"><input type="text" '+disabled1+' class="option-label" value="'+cools[k]["value"]+'" name="select-optionCv" placeholder="Value"><br>';
             if (k === 0){
                 disabled1 = '';
             }
         }
        tableRow =  codeblockR;
        tableCol = codeblockC;

        tabletype = "radio";
        selected = '';

    if (iid == 461){
    tabletype = "text";
    }
        for(var i = 0; i < rows; i++) {
            codeblock += '<tr>';

            for(var j = 0; j < cols; j++) {
                if (i===0){
                    codeblock += '<th id="'+iid+'_'+i+'_'+j+'" data-value = "'+cools[j]["value"]+'">';
                    if (j>0) {

                        codeblock += cools[j]["name"];
                    }
                    codeblock += '</th>';
                }else{
                    if (j===0) {
                        codeblock += '<th id="'+iid+'_'+i+'_'+j+'">';
                        codeblock += roows[i]["name"];
                        codeblock += '</th>';
                    }else{

                        if((typeof(values)!== "undefined" && (values.length != '0'))) {
                            try {
                                if ((values[i - 1]["row"] == i) && (values[i - 1]["value"] == cools[j]["value"])) {
                                    selected = 'checked';
                                } else {
                                    selected = '';
                                }
                            }catch (e) {
                                // handle the unsavoriness if needed
                            }
                        }
                        Cvalue = cools[j]["value"];
                        if (tabletype === "text"){
                            Cvalue = ''
                            if((typeof(values)!== "undefined" && (values.length != '0'))) {
                                for(var vv = 0; vv < values.length; vv++) {
                                    if ((values[vv]["row"] == i) && (values[vv]["col"] == j)) {
                                        Cvalue = values[vv]["value"]
                                    }
                                }

                            }
                        }
                        codeblock += '<td id="'+iid+'_'+i+'_'+j+'">';
                        codeblock += '<input required type="'+tabletype+'" name="'+iid+'_'+i+'_'+j+'" ' + selected + ' value="'+Cvalue+'">';
                        codeblock += '</td>';

                    }

                }

            }
            codeblock += '</tr>';

            if (i===0){
                codeblock +=rowClass;
            }
            codeblock += '<tr>'
        }
        codeblock += '</table>';

        return codeblock;
    }

    var field_label = '<label id="field_repIIDD" for="repIIDD" class="fb-repType-Label formzone pull-left">Text Field</label>';
    var field_actions = '<div class="pull-right"><a class="toggle-form btn glyphicon glyphicon-pencil" onclick="editor(\'vanco\',data_type)" title="Edit"></a><a  class="copy-button btn glyphicon glyphicon-duplicate" title="Copy"></a>' +
        '<a class="del-button btn delete-confirm" onclick="$(this).parent().parent().remove();" title="Remove Element">×</a></div>';

    $.fn.formilize = function () {
        $(this).empty();
        var formica = '<div id="mainFormEdit" class="col-md-9" style="border: dashed">' +
            '<ul class="connected"></ul> ' +
            '</div>';               // Create element with HTML
        var menu = '<div id="FormEditItems" class="col-md-3">' +
            '<ul id="sortable1" class="connectedSortable">' +
            '<li class="btn btn-default btn-block" data-type="checkbox" data-index="15">Checkbox Group</li>' +
            '<li class="btn btn-default btn-block" data-type="date" data-index="9">Date Field</li>' +
            '<li class="btn btn-default btn-block" data-type="paragraph" data-index="18">Paragraph</li>' +
            '<li class="btn btn-default btn-block" data-type="header" data-index="21">Header</li>' +
            '<li class="btn btn-default btn-block" data-type="number" data-index="2">Number</li>' +
            '<li class="btn btn-default btn-block" data-type="radio" data-index="14">Radio Group</li>' +
            '<li class="btn btn-default btn-block" data-type="select" data-index="17">Select</li>' +
            '<li class="btn btn-default btn-block" data-type="text" data-index="1">Text Field</li>' +
            '<li class="btn btn-default btn-block" data-type="textarea" data-index="16">Text Area</li>' +
            '<li class="btn btn-default btn-block" data-type="table" data-index="22">Table</li>' +
            '</ul>' +
            '<div class="pull-right"><button onclick="templates();" class="btn btn-default">Templates</button><button onclick="reset();" class="btn btn-danger">Reset</button><button onclick="trans(0,0,0);" class="btn btn-primary">New Form</button><button onclick="save();" class="btn btn-success">Save</button></div>' +
            '</div>';
        $(this).addClass("row formized");
        $(this).append(formica + menu);

        $(".btn").draggable({
            cursor: "move",
            revert: "invalid",
            helper: "clone",
            connectToSortable: '.connected'
        });
        $(".connected").sortable({
            cursor: "move",
            beforeStop: function (event, ui) {
                draggedItem = ui.item;
            },
            receive: function (event, ui) {
                outType = check_type(draggedItem, 1);
                $(draggedItem).replaceWith(outType);
            }

        });


    };

    $.fn.rendelize = function(anotherJson,outputType) {
        $(this).empty();
        var employees = anotherJson; //get employee object
        var outDIv = '';
        for (var employee in employees) {

            if (outputType === 3){
                outType = check_type(employees[employee], outputType);
            }else {
                outType = check_type(employees[employee], 2);
            }

            if (!outType) {
                outType = '';
            }
            outDIv = outDIv + outType;
        }
if (outputType === 2){
    return  outDIv
}else   {
    $(this).append(outDIv + '');
}


    };


    function editor(something,data_type) {
        var ele = $('#'+something);
        if (ele.length) {

            if ((data_type==='paragraph')||(data_type==='header')){
                var f_ele = $('#'+something).html();
            }else if (data_type === 'select' || data_type === 'checkbox' || data_type === 'radio') {

                edit_for_options(something,data_type);
                var f_ele = $('#field_'+something).html();
            }else if (data_type === 'table'){
                edit_for_options(something,data_type);
                var f_ele = $('#field_'+something).html();
            } else{
                var f_ele = $('#field_'+something).html();
            }
            ele.replaceWith(field_edit(something,data_type,f_ele).replace(/vanco/g, something));

            $( ".sortable-options" ).sortable();
        }else{

            $('label#field_'+something).remove();
            //select class of label formzone and remove label by id
            $('#main'+something).replaceWith(check_type(lodod(something)[0], 3));
        }
    }



    function add_option(something) {
        var ele = $('#ol_'+something);
        ele.append('<li class="ui-sortable-handle"><input type="radio" class="option-selected" value="false" name="selected-option" placeholder=""><input type="text" class="option-label" value="Option 3" name="select-option" placeholder="Label"><input type="text" class="option-value" value="Option 3" name="select-value" placeholder="value"><a onclick="$(this).parent().remove();" class="remove btn" title="Remove Element">×</a>');
    }
    function add_rowCol(row,col) {
        var codeblockR = $('#Trow');
        var codeblockC = $('#Tcol');
        var codeblockRi = $('#Trow input');
        var codeblockCi = $('#Tcol input');

        if(codeblockRi.length<row){
            codeblockR.append('<input type="text" class="option-label" value="Option '+row+'" name="select-optionR" placeholder="Label">');
        }else if(codeblockRi.length>row){
            codeblockR.children().last().remove();
           // codeblockR.removeChild(codeblockR.childNodes[codeblockRi.length - 1]);
        }
        if(codeblockCi.length<col){
            codeblockC.append('<input type="text" class="option-label" value="Option '+col+'" name="select-optionC" placeholder="Label"><input type="text" class="option-label" value="Option '+col+'" name="select-optionCv" placeholder="Value">');
        }else if(codeblockCi.length>col){
            codeblockC.children().last().remove();
          //  codeblockC.removeChild(codeblockC.childNodes[codeblockCi.length - 1]);
        }
    }

    function updateLabel(something,another) {
        $('#field_'+something).html(another);
    }

    function field_edit(something,typ,valuey){

        if(typeof valuey === "undefined") {
            valuey = '';
        }
        var fieldi_edit = '<div id="div_vanco" class="edit_template">'+
            '<br><label class="pull-left">Label</label>'+
            '<textarea name="label" type="textarea" nonly="'+typ+'" vanshe="'+something+'" placeholder="Label" class="fld-label form-control" onkeyup="updateLabel(\''+something+'\',this.value)">'+valuey+'</textarea><br>' +
            '';

        if (typ === 'text' || typ === 'date' || typ === 'number' || typ === 'textarea') {

            fieldi_edit += '<label>Required</label> &nbsp; &nbsp;'+
                            '<input type="checkbox" class="fld-required" name="required" value="required"><br>' +
                            '<label class="pull-left">Max</label>  &nbsp; &nbsp;<input type="number" class="fld-required" min="1" name="fld_max" value="1"><br>'+
                            '<label>Placeholder</label> '+
                            '<textarea  name="placeholder" class="form-control"></textarea><br>';
        }
        else if (typ === 'select' || typ === 'checkbox' || typ === 'radio') {

            fieldi_edit += '<label class="pull-left">Scorable</label>  &nbsp; &nbsp;<input type="checkbox" class="fld-required" min="1" name="fld_score" value="1"><br>' +
                '<div class="form-group field-options">' +
                '<label class="false-label">Options</label>' +
                '<div class="sortable-options-wrap">' +
                '<ol class="sortable-options ui-sortable" id="ol_'+something+'">' +
                 outOptions+
                '</ol>' +
                '<div class="option-actions"><a class="add add-opt btn btn-default pull-right" onclick="add_option(\''+something+'\')">Add Option +</a></div>' +
                '</div>' +
                '</div>';

        }        else if (typ === 'table') {

            fieldi_edit += '<div class="row"><div class="col-sm-4"><label>Type of Table : </label></div>' +
                '<div class="col-sm-8"><select>' +
                '<option>Number</option>' +
                '<option>Select Options</option>' +
                '<option selected>Radio</option>' +
                '</select></div></div><br>' +
                '<label class="pull-left">Scorable</label>  &nbsp; &nbsp;<input type="checkbox" class="fld-required" min="1" name="fld_score" value="1"><br>' +
                '<div class="row">' +
                '<div class="col-sm-2"><label>Number of row and column : </label></div>' +
                '<div class="col-sm-3"><input id="trowC" type="number" onchange="add_rowCol($(\'#trowC\').val(),$(\'#tcolC\').val())" value="'+tableRowCount+'" min="1" placeholder="number of rows"></div>' +
                '<div class="col-sm-7"><input id="tcolC" type="number" onchange="add_rowCol($(\'#trowC\').val(),$(\'#tcolC\').val())" value="'+tableColCount+'" min="1" placeholder="number of columns"></div></div>' +
                '<br><div class="form-group field-options">' +
                '<div class="row"><div class="col-sm-2"><label class="false-label">Options:</label></div>' + '<div class="col-sm-3"><label class="false-label">Rows &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</label><div id="Trow">'+tableRow+'</div></div>' + '<div class="col-sm-7"><label class="false-label">Columns &nbsp; &nbsp;</label><div id="Tcol">'+tableCol+'</div></div></div>'+
                '</div>';

        }
        return fieldi_edit + '</div>';
    }


    function lodod(JsonDiv) {
        var json = [];
        //dont forget that formzone is the class
        var label;
        var nonly;
        var vanshe;
        var scorable;
        var max;
        var placeholder;
        var required;
        var values=[];
        var rows=[];
        var columns=[];
        var jokingbird = '';
        $("#div_" + JsonDiv + " :input").each(function () {
            if ($(this).attr('type') === "checkbox") {
                required = $(this).val();
            } else if ($(this).attr('name') === "label") {
                label = $(this).val();
                nonly = $(this).attr("nonly");
                vanshe = $(this).attr("vanshe");
            } else if (($(this).attr('name') === "placeholder")) {
                placeholder = $(this).val();
            }else if (($(this).attr('name') === "select-option")) {
                values.push({"label":$(this).val(),"selected":"false","value":$(this).next().val()});
                jokingbird = 1;
            }else if (($(this).attr('name') === "select-optionR")) {
                rows.push({"name":$(this).val()});
            }else if (($(this).attr('name') === "select-optionC")) {
                columns.push({"name":$(this).val(),"value":$(this).next().val()});
            }else if (($(this).attr('name') === "fld_score")) {
                scorable = $(this).val();
            }else if (($(this).attr('name') === "fld_max")) {
                max = $(this).val();
            }else if (($(this).attr('name') === "required")) {
                required = $(this).val();
            }
        });
        if(jokingbird!=1){
            values='';
        }
        json.push({
            "type": nonly,
            "label": label,
            "name": vanshe,
            "rows":rows,
            "columns":columns,
            "choices":[],
            "placeholder": placeholder,
            "value": values,
            "readonly": " ",
            "min": "",
            "max": max,
            "required": required,
            "scorable": scorable
        });
        return json;
    }

    function reset(){

        if (confirm("Do you really want to clear fields \nYou would lose unsaved changes") === true) {
            $("#mikform").formilize();
        }

    }
    function save() {
        var json = [];
        $('.main-form').each(function () {
            //  var options = [];
            var optionValues = [];
            var tag = $(this).attr('data-type');
            if ((tag === 'paragraph')) {
                id = $(this).children('p').attr('id');
                json.push({
                    "type": tag,
                    "label": $('#'+id).text(),
                    "name": id,
                    "placeholder": '',
                    "value": "",
                    "readonly": " ",
                    "min": "",
                    "max": "",
                    "required": ""
                });
            }else if ((tag === 'header')) {
                id = $(this).children('h3').attr('id');
                json.push({
                    "type": tag,
                    "label": $('#'+id).text(),
                    "name": id,
                    "placeholder": '',
                    "value": "",
                    "readonly": " ",
                    "min": "",
                    "max": "",
                    "required": ""
                });
            }
             else if ((tag === 'date')||(tag === 'number')||(tag === 'text')) {
                json.push({
                    "type": tag,
                    "label": $(this).children('label').text(),
                    "name": $(this).children(tag).attr('id'),
                    "placeholder": $(this).children('input').attr('placeholder'),
                    "value": "",
                    "readonly": "",
                    "min": "",
                    "max": "",
                    "required": "required"
                });
            }else if ((tag === 'select')) {
               id = $(this).children(tag).attr('id');


                $('#'+id).children('option').each(function() {
                    optionValues.push({"label":$(this).text(),"selected":"false","value":$(this).val()});
                });

                json.push({
                    "type": tag,
                    "label": $('#field_'+id).text(),
                    "name": id,
                    "placeholder": '',
                    "value": optionValues,
                    "readonly": "",
                    "min": "",
                    "max": "",
                    "required": "required"
                });
            }else if ((tag === 'checkbox')||(tag === 'radio')) {

                id = $(this).children('label').attr('for');

                $('#'+id).find('input').each(function() {
                    optionValues.push({"label":$(this).parent().text(),"selected":"false","value":$(this).val()});
                });
                json.push({
                    "type": tag,
                    "label": $('#field_'+id).text(),
                    "name": id,
                    "placeholder": '',
                    "value": optionValues,
                    "readonly": "",
                    "min": "",
                    "max": "",
                    "required": "required"
                });
            }else if ((tag === 'textarea')) {
                json.push({
                    "type": tag,
                    "label": $(this).children('label').text(),
                    "name": $(this).children(tag).attr('id'),
                    "placeholder": $(this).children('textarea').attr('placeholder'),
                    "value": "",
                    "readonly": "",
                    "min": "",
                    "max": "",
                    "required": "required"
                });
            }else if ((tag === 'table')) {

                id = $(this).children('h4').attr('for');

                var ttble = $('#'+id);
                var ttable = document.getElementById(id);
                var ttbleCountR = ttble.find('tr').length;
                var ttbleCountC = ttable.rows[0].cells.length;
                var rows=[];
                var columns=[];
                columns.push({"name":'generic 1'});
                rows.push({"name":'generic 1'});
                for(var i = 0; i < ttbleCountR/2; i++) {

                    for(var j = 0; j < ttbleCountC; j++) {

                        if ((i===0)&&(j!==0)){
                            columns.push({"name":$('#'+id+'_'+i+'_'+j).text(),"value":$('#'+id+'_'+i+'_'+j).attr('data-value')});

                        }else if ((j===0)&&(i!==0)) {
                                rows.push({"name":$('#'+id+'_'+i+'_'+j).text()});

                            }

                        }

                    }
                json.push({
                    "type": tag,
                    "label": $('#field_'+id).text(),
                    "name": id,
                    "placeholder": '',
                    "rows":rows,
                    "columns":columns,
                    "choices":[],
                    "value": "",
                    "readonly": "",
                    "min": "",
                    "max": "",
                    "required": "required"
                });
            }
        });
        var forms = {};
        var settings = [];

        settings.push({
                "form_names": $('#form_names').val()
            }, {"form_upload": $('#form_upload').prop('checked')},
            {
                "form_qc": $('#page_number').val()
            });

        forms['form_settings'] = settings;
        forms['form_elements'] = json;

        $.ajax({
            url: 'xxxxxx',
            type: 'POST',
            async: true,
            crossDomain: true,
            cache: false,
            xhrFields: { withCredentials:true },
            data:forms,
            contentType: 'application/x-www-form-urlencoded',
            success: function(data){
                location.reload();
            }
        });


    }
    
    function edit_for_options(id,tag) {
        var optionValues = [];
        if ((tag === 'select')) {
            $('#'+id).children('option').each(function() {
                optionValues.push({"label":$(this).text(),"selected":"false","value":$(this).val()});

            });
        }else if ((tag === 'checkbox')||(tag === 'radio')) {


            $('#'+id).find('input').each(function() {
                optionValues.push({"label":$(this).parent().text(),"selected":"false","value":$(this).val()});
            });
        }else if ((tag === 'table')) {


            var ttble = $('#'+id);
            var ttable = document.getElementById(id);
            var ttbleCountR = ttble.find('tr').length;
            var ttbleCountC = ttable.rows[0].cells.length;
            var rows=[];
            var columns=[];
            columns.push({"name":'generic 1'});
            rows.push({"name":'generic 1'});
            for(var i = 0; i < ttbleCountR/2; i++) {

                for(var j = 0; j < ttbleCountC; j++) {

                    if ((i===0)&&(j!==0)){
                        columns.push({"name":$('#'+id+'_'+i+'_'+j).text(),"value":$('#'+id+'_'+i+'_'+j).attr('data-value')});

                    }else if ((j===0)&&(i!==0)) {
                        rows.push({"name":$('#'+id+'_'+i+'_'+j).text()});

                    }

                }

            }

            var codeblockR = '';
            var codeblockC = '';
            var disabled = 'disabled';
            var disabled1 = 'disabled';

            tableRowCount =rows.length;
            tableColCount =columns.length;

            for(var k = 0; k < rows.length; k++) {
                codeblockR += '<input type="text" '+disabled+' class="option-label" value="'+rows[k]["name"]+'" name="select-optionR" placeholder="Label"><br>';
                if (k === 0){
                    disabled = '';
                }
            }
            for(var k = 0; k < columns.length; k++) {
                codeblockC += '<input type="text" '+disabled1+' class="option-label" value="'+columns[k]["name"]+'" name="select-optionC" placeholder="Label"><input type="text" '+disabled1+' class="option-label" value="'+columns[k]["value"]+'" name="select-optionCv" placeholder="Value"><br>';
                if (k === 0){
                    disabled1 = '';
                }
            }
            tableRow =  codeblockR;
            tableCol = codeblockC;
        }
        outOptions ='';
        for(var k = 0; k < optionValues.length; k++) {
            outOptions += '<li class="ui-sortable-handle"><input type="radio" class="selected-option" value="false" name="selected-option" placeholder=""><input type="text" class="option-label" value="'+optionValues[k]["label"]+'" name="select-option" placeholder="Label"><input type="text" class="option-value" value="'+optionValues[k]["value"]+'" name="select-value" placeholder="Value"><a onclick="$(this).parent().remove();" class="remove btn" title="Remove Element">×</a>' +
                '</li>'
        }

    }


