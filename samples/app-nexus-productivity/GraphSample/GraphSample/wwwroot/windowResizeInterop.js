codewindow.addEventListener('resize', function () {
    DotNet.invokeMethodAsync('GraphSample', 'WindowResized');
});
 