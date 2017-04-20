$(() => {
    $("#upload_finalize").on('click', (e) => {
      e.preventDefault();
      $("#upload_status").text("Processing upload");
      const files = document.getElementById('file-input').files;
      const file = files[0];
      $.get('/sign-s3',
        {"file-name": file.name, "file-type": file.type},
        (data, textStatus, jqXHR) => {
          const dataInfo = JSON.parse(data);
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', dataInfo.signedRequest);
          xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
              if(xhr.status === 200){
                $("#upload_status").text("Upload complete");
              }
              else{
                alert('Could not upload file.');
              }
            }
          };
          xhr.send(file);
        }
      );
    });
  }
);
