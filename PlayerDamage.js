#pragma strict

private var anim : Animator;

static var damageState : int = Animator.StringToHash('Base Layer.Damage');
public var thePlayer : GameObject;
thePlayer = GameObject.FindWithTag('Player');
public var force : float = 200.0;
public var rb : Rigidbody;
rb = thePlayer.GetComponent(Rigidbody);

function Start() {
	anim = GetComponent('Animator');
}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "flame"){
	  var direction : Vector3 = (transform.position - other.gameObject.transform.position).normalized;
	  //Debug.Log(direction);
	  anim.SetBool("Damage", true);
	  thePlayer.GetComponent(PlayerControl).enabled = false;
	  rb.AddForce(direction * 200);
	}
}

function OnTriggerExit (other : Collider) {
	if(other.tag == "flame"){
	  //Debug.Log("walked out of the fire");
	  anim.SetBool("Damage", false);
	  thePlayer.GetComponent(PlayerControl).enabled = true;
	}
}