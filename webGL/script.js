var main = function() {

    let CANVAS = document.getElementById("my_canvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    /*========================= GET WEBGL CONTEXT ================ */
    let GL;
    try {
        GL = CANVAS.getContext("experimental-webgl", {
            antialias: true
        });
    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }

    /*========================= SHADERS ========================= */

    let shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    varying vec3 vColor;
    void main() {
        gl_Position = vec4(position.x, position.y, position.z, 1.0);
        vColor = color;
    }
    `;

    let shader_fragment_source = `
    precision mediump float;

    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;

    /*================================================== */

    let GetShader = function(source, type, typeString) {
        let shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        // Error handling :
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
            return false;
        }

        return shader;
    };

    let shader_vertex = GetShader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    let shader_fragment = GetShader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    // Create final shader program :
    let SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    GL.linkProgram(SHADER_PROGRAM);

    let _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    let _color = GL.getAttribLocation(SHADER_PROGRAM, "color")

    GL.enableVertexAttribArray(_position);
    GL.enableVertexAttribArray(_color);
    GL.useProgram(SHADER_PROGRAM);

    /*========================= THE TRIANGLE ========================= */

    //POINTS :
    let triangle_vertex = [
        -0.5, -0.5, 0.0,
        0, 0, 1,
        0.5, -0.5, 0.0,
        1, 1, 0,
        0.0, 0.5, 0.0,
        1, 0, 0,
        0.5, 0.5, 0.0,
        0, 1, 0,
    ];

    let TRIANGLE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
        new Float32Array(triangle_vertex),
        GL.STATIC_DRAW /* the data is set only once and used many times.*/ );

    //FACES :
    let triangle_faces = [0, 1, 2, 0, 2, 3];

    let TRIANGLE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(triangle_faces),
        GL.STATIC_DRAW);

    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    let animate = function() {

        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
        GL.vertexAttribPointer(_position /*position of vertex attribute*/ ,
            3 /*Size of vertex attribute (v3)*/ ,
            GL.FLOAT /* Type of data */ ,
            false /* Should the attributes be normalised*/ ,
            4 * (3 + 3) /*Stride(Bytes) : 4 Bytes x 2 */ ,
            0 /*Offset : 0 */ );

        GL.vertexAttribPointer(_color /*position of vertex attribute*/ ,
            3 /*Size of vertex attribute (v3)*/ ,
            GL.FLOAT /* Type of data */ ,
            false /* Should the attributes be normalised*/ ,
            4 * (3 + 3) /*Stride(Bytes) : 4 Bytes x 2 */ ,
            3 * 4 /*Offset : 0 */ );

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate();
};
