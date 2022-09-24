tinymce.init({
    selector: 'textarea#description',
    height: 500,
    menubar: false,
    plugins: [],
    toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat'
});
