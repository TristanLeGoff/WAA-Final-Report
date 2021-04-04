const canvas = document.getElementById('canvas')

// initiating 2D context on it
const c = canvas.getContext('2d')


let username = ''
let isDrawing = false;
let x = 0;
let y = 0;

//EVENT

addEventListener('load', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    let draw_btn = document.getElementById('draw')
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect()
    x = e.clientX - rect.left
    y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)

    isDrawing = true

})

canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        //drawCircleAtCursor(x,y,canvas, e)
        drawLine(x, y, e.offsetX, e.offsetY);
        sendLine({ user: username, x: x, y: y, x2: e.offsetX, y2: e.offsetY, pencil_color: document.getElementById('pencil_color').value, pencil_size: parseInt(document.getElementById('pencil_size').value) })
        x = e.offsetX;
        y = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        //drawCircleAtCursor(x,y,canvas, e)
        drawLine(x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

//FIGURE
function openImage() {
    var dataURL = canvas.toDataURL();
    console.log(dataURL);
    newData(dataURL);
}

function newData(data) {
    const base64ImageData = data
    const contentType = 'image/png';

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
}

function draw() {
    let forme = document.getElementById('form').value
    if (forme == 'triangle') {
        drawTriangle()
    }
    else if (forme == 'square') {
        drawSquare()
    }
    else if (forme == 'circle') {
        drawCircle()
    }
}

function drawTriangle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true) {
    c.beginPath()
    c.moveTo(start[0], start[1])
    c.lineTo(start[0], start[1] + figSize)
    c.lineTo(start[0] + figSize, start[1] + figSize)
    c.closePath()

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

}

function drawSquare(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true) {
    c.rect(start[0], start[1], figSize, figSize)

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()
}

function drawCircle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true) {
    c.beginPath()
    c.arc(start[0], start[1], figSize / 2, 0, Math.PI * 2)
    c.closePath()

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

}

function getStartingPoint(figSize, borderSize) {
    let x = (Math.random() * (innerWidth - figSize - borderSize)) + borderSize
    let y = (Math.random() * (innerHeight - figSize - borderSize)) + borderSize
    return [x, y]
}

//LINE

function drawLine(x1, y1, x2, y2, pencil_color = document.getElementById('pencil_color').value, pencil_size = parseInt(document.getElementById('pencil_size').value)) {
    // using a line between actual point and the last one solves the problem
    // if you make very fast circles, you will see polygons.
    // we could make arcs instead of lines to smooth the angles and solve the problem
    c.beginPath();
    c.strokeStyle = pencil_color;
    c.lineWidth = pencil_size;
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.closePath();
}

function drawCircleAtCursor(x, y, pencil_color = document.getElementById('pencil_color').value, pencil_size = parseInt(document.getElementById('pencil_size').value)) {
    // Problem with draw circle is the refresh rate of the mousevent.
    // if you move too fast, circles are not connected.
    // this is browser dependant, and can't be modified.
    c.beginPath()
    c.arc(x, y, 10 / 2, 0, Math.PI * 2)
    c.closePath()

    c.lineWidth = pencil_size
    c.strokeStyle = pencil_color
    c.stroke()

    c.fillStyle = pencil_color
    c.fill()
}
