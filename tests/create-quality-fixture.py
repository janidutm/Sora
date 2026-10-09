from pathlib import Path
import subprocess
root=Path('work/quality-fixture').resolve();root.mkdir(parents=True,exist_ok=True)
for name,size in [('low','320x180'),('high','640x360')]:
    subprocess.run([r'C:\Users\JaniduTM\ffmpeg\bin\ffmpeg.exe','-hide_banner','-loglevel','error','-y','-f','lavfi','-i',f'testsrc=size={size}:rate=24','-t','24','-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-g','48','-sc_threshold','0','-f','hls','-hls_time','2','-hls_list_size','0',str(root/(name+'.m3u8'))],check=True)
(root/'master.m3u8').write_text('#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=150000,RESOLUTION=320x180\nlow.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=600000,RESOLUTION=640x360\nhigh.m3u8\n')
