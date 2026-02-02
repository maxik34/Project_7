#target photoshop


// DISCLAIMER: This script is written by AI


function InitializeScript()
{
    if (!documents.length)
		return;
	
    var doc = activeDocument;
	
    // Input dialog
    var scaleFactor = prompt("Enter scaling factor for Vector Feather:\n(Example: 2 to double, 0.5 to halve)", "2");
    
    if (scaleFactor === null) // Exit if Cancel is pressed
		return;
	
    scaleFactor = parseFloat(scaleFactor.replace(",", ".")); // Handle both dot and comma
    
    if (isNaN(scaleFactor) || scaleFactor <= 0)
	{
        alert("Please enter a valid number greater than 0.");
        return;
    }

    function processLayers(layers)
	{
        for (var i = 0; i < layers.length; i++)
		{
            var layer = layers[i];
			
            if (layer.typename === "LayerSet")
                processLayers(layer.layers); // Recursive search through groups
			else
                scaleFeather(layer);
        }
    }

    function scaleFeather(layer)
	{
        try
		{
            var ref = new ActionReference();
            ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("vectorMaskFeather"));
            ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
            var desc = executeActionGet(ref);

            if (desc.hasKey(stringIDToTypeID("vectorMaskFeather")))
			{
                var currentFeather = desc.getUnitDoubleValue(stringIDToTypeID("vectorMaskFeather"));
                
                if (currentFeather > 0)
				{
                    var setDesc = new ActionDescriptor();
                    var layerRef = new ActionReference();
                    layerRef.putIdentifier(charIDToTypeID("Lyr "), layer.id);
                    setDesc.putReference(charIDToTypeID("null"), layerRef);
                    
                    var featherDesc = new ActionDescriptor();
                    featherDesc.putUnitDouble(stringIDToTypeID("vectorMaskFeather"), charIDToTypeID("#Pxl"), currentFeather * scaleFactor);
                    setDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), featherDesc);
                    
                    executeAction(charIDToTypeID("setd"), setDesc, DialogModes.NO);
                }
            }
        }
		catch (e)
		{
            // Skip layers without vector masks
        }
    }

    // Wrap everything in a single history state
    doc.suspendHistory("Scale Vector Feather by " + scaleFactor, "processLayers(doc.layers)");
}


InitializeScript();