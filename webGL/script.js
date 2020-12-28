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

    /*jshint multistr: true */
    let shader_vertex_source = "\n\
    attribute vec2 position; //the position of the point\n\
    \n\
    \n\
    void main(void) { //pre-built function\n\
        gl_Position = vec4(position, 0., 1.);\n\
    }";


    let shader_fragment_source = "\n\
    precision mediump float;\n\
    \n\
    \n\
    void main(void) {\n\
        gl_FragColor = vec4(1.0, 0.5, 0.5, 1.0);\n\
    }";

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

    GL.enableVertexAttribArray(_position);
    GL.useProgram(SHADER_PROGRAM);

    /*========================= THE TRIANGLE ========================= */

    //POINTS :
    let triangle_vertex = [
        -1, -1,
         1, -1,
         1, 1,
    ];

    let TRIANGLE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
        new Float32Array(triangle_vertex),
        GL.STATIC_DRAW);

    //FACES :
    let triangle_faces = [0, 1, 2];

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
        GL.vertexAttribPointer(_position /*position of vertex attribute*/,
             2 /*Size of vertex attribute (v2)*/,
             GL.FLOAT /* Type of data */,
             false /* Should the attributes be normalised*/,
             4 * 2 /*Stride(Bytes) : 4 Bytes x 2 */,
             0 /*Offset : 0 */);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate();
};
