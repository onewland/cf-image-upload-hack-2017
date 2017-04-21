$(() => {
    const uploadFile = (signedUrl, file) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl);
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

    $("#upload_finalize").on('click', (e) => {
      e.preventDefault();
      $("#upload_status").text("Processing upload");
      const files = document.getElementById('file-input').files;
      const file = files[0];
      $.get('/copy-job', {}, (data) => {
        const jobCopyInfo = JSON.parse(data);
        const jobId = jobCopyInfo.job_id;
        $("#cf_job_url").attr('href', `https://make.crowdflower.com/jobs/${jobId}`);
        $("#cf_job_url").show();
        $("#cf_job_preflight").hide();


        $.get('/sign-s3',
          {"file-name": file.name, "file-type": file.type, "job-id": jobId},
          (data, textStatus, jqXHR) => {
            const dataInfo = JSON.parse(data);
            uploadFile(dataInfo.signedRequest, file);
          }
        );
      });

    });
  }
);
