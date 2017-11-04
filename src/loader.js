import BottomBar from 'inquirer/lib/ui/bottom-bar';
class Loader {
  constructor() {
    this.ui='';
    this.word='';
    this.loader = ['/', '|', '\\', '-'];
    this.i=3;
    this.running=false;
  }
  start(word) {
    this.running=true;
    if (word) {
      this.word=' '+word;
    }
    this.ui=new BottomBar({bottomBar: this.loader[this.i%4]+this.word});
    this.timer=setInterval(()=>{
      this.ui.updateBottomBar(this.loader[this.i++ % 4]+this.word);
    }, 100);
  }
  stop(msg) {
    const output=msg?msg+'\n':'';
    if (this.running) {
      this.running=false;
    clearInterval(this.timer);
    this.ui.updateBottomBar(this.loader[3]+this.word);
    this.ui.updateBottomBar(output);
    this.ui.close();
  }
  };
};

export default Loader;
