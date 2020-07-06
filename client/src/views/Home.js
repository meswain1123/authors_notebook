import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  notFromLogin
} from "../redux/actions/index";
import MediaCard from "../components/Displays/MediaCard";
// import ContentEditableBox from "../components/Inputs/ContentEditableBox";

const mapStateToProps = state => {
  return {
    fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    notFromLogin: () => dispatch(notFromLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0",
      redirectTo: null
    };
  }

  componentDidMount() {}

  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div>
          <h3>Author's Notebook</h3>

          <MediaCard title="Getting Started" description="This video explains the basics of how to use the website and its tools.  It covers the basic concepts, navigation, creating a project, importing templates, creating types, creating attributes, and creating things." />
{/* 
          <p>
            This is something that I've been wanting to build for a while. It's
            purpose is to provide a place for keeping track of various aspects of
            books that an author is writing. It is able to keep track of details
            about characters, organizations, systems, and even storylines. I would
            like to make it so it's publicly available, and that any authors
            (aspiring and published) can use it to help them organize their
            stories. I want to make it automate a number of things, but the
            biggest part is to make it very dynamic and to allow for storage of
            all different kinds of notes. In order to make it publicly available
            however, it needs to at least be able to pay for itself. I'm not
            talking about the time I spent/spend working on it, but the costs of
            hosting the website, the db, and the url. Until I'm sure it's capable
            of doing those things, I can't let everyone have access to it.
          </p>
          <p>
            This is version 1 of instructions of how to use it. If I make it
            available for anyone, I'll update it with some video instructions.
          </p>
          <p>
            One thing you need to know is that this is a hobby project of mine.
            I'm working on it by myself for now. I've got a real job, and I've got
            a family, so this isn't my top priority, but that being said I do care
            about this probject, and I do plan to get to all the things that are
            on my to do list.
          </p>
          <p>
            If you want to do more than just look at the things others have put on
            (and which they're allowing you to see), then you'll have to register.
            Making it use Facebook and/or Google authentication is on my to do
            list. I know how to do that, but I just haven't gotten around to it.
            So, for now, just register and login. It currently doesn't send any
            emails, so if you forget your password or something, you'll have to
            reach out to me, and I can straighten it out. Again, that kind of
            thing is also on my to do list.
          </p>
          <p>
            Once you're logged in then you're able to start keeping track of
            things.
          </p>
          <p>
            The first thing you create is currently called a World. This is a
            holdover from when I was calling this my World Building App because I
            was aiming it for Fantasy/Sci-Fi authors (like me), but I realized
            that it could be used for anything really. If anyone has any
            suggestions for something to call this instead of World, I'm open to
            considering other options. Currently I'm considering changing it to
            'Project', and I may do that before showing it to anyone other than
            family and close friends. Anyway, a World is basically the root of
            everything. Different Worlds aren't connected to each other. Each
            World has a Name, and you can choose whether or not to make it Public.
            If it's not Public then only the Owner (whoever created it) is able to
            see it. If it is Public then anyone can see it, but only the Owner can
            edit it. (Planned Future Features: When you create a new world you can
            use a template which will include generic Types common to that type of
            World, such as Character, Location, etc. I'm also planning to add the
            ability for Owners to add Collaborators to their World. Collaborators
            would be able to see the World, and the Owner would be able to control
            their other permissions as well (create/edit type, delete type,
            create/edit thing, and delete thing.). Only the Owner will have the
            ability to Edit or Delete the World itself, but they will be able to
            make someone else the Owner.)
          </p>
          <p>
            Within a World you are able to define Types. Basically a Type is just
            that. It's a Type of Thing that you want to keep track of. In each
            Type you are able to define attributes which that Type of Thing share,
            such as Characters having Age, Race, Gender, Height, Weight, Skin
            Color, Eye Color, etc. Types can also be hierarchical through
            inheritance. For example, in Harry Potter I would have a 'Character'
            Type with all the attributes I listed above, but then I could have a
            'Witch or Wizard' Type which has 'Character' as a Super Type. This
            means that 'Witch or Wizard' already has all those same Attributes as
            'Character', but you can add more Attributes like Wand, Known Spells,
            etc. The way to set the Super Types for a type is with a control
            called a Multi Select. It's basically a textbox, but as you type it
            gives you suggestions. You click a suggestion and it adds a chip
            showing it as selected. Clicking the x on the right of the chip
            unselects it. When selecting a Type to be a Super Type it adds all the
            Attributes of that Type to the Type you're creating or editing, but
            they are greyed out and disabled for editing. The reason they're grey
            and disabled is that they come from a Super Type, so their definition
            is there. If a Super Type is removed then the Attributes remain, but
            are no longer grey and disabled. They can then be edited. There are a
            few more things to note however. First is that when adding a Super
            Type which has Super Types, those Super Types will be added as well.
            An example of this could be the 'Animagus' Type in Harry Potter.
            'Animagus' has the Super Type 'Witch or Wizard', which has the Super
            Type 'Character', so when defining 'Animagus' I could add 'Witch or
            Wizard' as a Super Type, and that will automatically add 'Character'
            as well. Removing a Super Type of other Super Types will remove all
            Sub Types of the Super Type removed. An example of that would be
            removing 'Character' from 'Animagus'. This would automatically remove
            'Witch or Wizard' as well. It doesn't make sense to do that for
            'Animagus', but it may be necessary for you if you want to rethink how
            you're organizing things. The last thing to note about removing Super
            Types is that so long as a single Super Type exists which has an
            Attribute with that name, it will be greyed out and disabled. Another
            note about Attributes is that their names have to be unique on the
            Type (or Thing). It's generally a good idea to make sure that any
            Attributes you define with the same name also have the same Attribute
            type as well, otherwise you may run into Attribute name collisions.
            One last thing about Types. I've added an option to Types called Major
            Type. If it's checked then the Type is considered a Major Type and
            will show up in places of the UI where a regular Type will not. This
            makes finding, creating, and editing Things of that Type easier. I
            would make 'Character' a Major Type, but 'Witch or Wizard' and
            'Animagus' would be regular Types. (Planned Future Features: Template
            Types like I have above for Template Worlds, but they're individual
            Types. Also add Plural Name field which will be used in the UI for
            places where we put the plural name of something. Currently it just
            adds an 's' to the end of the Type name, and I want to continue to do
            that if the Plural Name is left empty, but if it's not empty then
            display the Plural Name instead.)
          </p>
          <p>
            Types have Attributes (as mentioned above). Things (which I'll get
            into more below) also have Attributes. The same Attributes really. In
            the Harry Potter World the Attributes on the 'Character' Type would
            then be given to every character you create afterward, but now instead
            of naming the Attribute and saying what type of Attribute it is, you
            get to specify a value for the Attribute.
          </p>
          <p>
            An Attribute is anything you may wish to keep track of for anything.
            These do not include Name or Description, because all Types and Things
            always have Name and Description by default. Attributes are for
            anything else you want to keep track of. It could be a relationship
            like 'Friend', 'Family Member', 'Significant Other', 'Coworker', etc.
            It could be skills and abilities, or possessions, or jobs, or home
            address, or work or school schedule. Really anything you want to keep
            track of which is part of something can be an Attribute. Currently
            there are six types of Attributes that are supported: Text, Number,
            True/False, Options, Type, and List. Text is just that. A Text
            Attribute gives you a textbox where you can type anything you want to
            keep track of. Number gives you a number box, which is like a textbox
            but it only accepts numbers, and it has arrows on the right which can
            be used to increment or decrement the number. True/False gives you a
            checkbox. Options allows you to specify possible choices for the
            Attribute, and then they show up in a drop down list (A quick example
            of this could be 'Gender' having 'Male', 'Female', and others if you
            wanted. They can have as many options as you want, and it can be used
            for whatever Attribute you want.). Specifying the choices is done
            using a control called a Chip Input. This looks like a regular
            textbox, but whenever you hit enter the text in it is added as a chip.
            Chips show the text, but have an x on their right which can be used to
            remove them. It's basically like the Multiselect except without the
            suggestions. The Chips are the choices that will be in the drop down
            list which the user has when creating or editing a Thing with that
            Attribute.
          </p>
          <p>The last two Attribute types are a little more complicated.</p>
          <p>
            When adding Attributes to a Type, the 'Type' Attribute type allows you
            to then choose from the various Types you've defined for the World,
            and then when you're creating or editing a Thing (such as the
            'Character' 'Harry Potter') you would get all the Things of that Type
            as choices in a drop down list. For example you could have a 'Best
            Friend' Attribute which has the Attribute type of 'Type' and uses the
            Defined Type of 'Character'. Then when editing Harry you would have a
            drop down list which shows all the 'Characters' you've added to the
            World as possible 'Best Friends'. You would of course then choose 'Ron
            Weasley' (Sorry, Hermione, but you're a close second.).
          </p>
          <p>
            The Attribute Type 'List' is still more complicated than 'Type'. It
            allows you to decide which type of 'List' it's going to be. For now it
            only supports 'Text', 'Options', and 'Type'. (I'm not planning to add
            any others, but if it's requested I may consider it. A List of Text
            could be anything really, so other types shouldn't be necessary.) If
            an Attribute is defined as a List of Text then when creating or
            editing a Thing the Attribute gives a Chip Input, which works the same
            as it does for Options (described above). A List of Options allows you
            to define the choices when creating or editing the Type, the same as
            with a regular Options Attribute, and then when creating or editing a
            Thing of that Type it gives a Multiselect which works the same as when
            choosing Super Types (described above) with the Options defined
            previously on the Type as the suggestions. A List of 'Type' allows you
            to choose a Defined Type (like with the Attribute type 'Type'), but
            when creating or editing a Thing it gives you a Multiselect instead of
            a regular drop down list so you can select more than one. With all
            'List' Attributes, the items in the list are displayed separated by
            commas when looking at the details page rather than creating or
            editing.
          </p>
          <p>
            One last note about Attributes of type 'Type' or 'List' of 'Type'.
            I've made it so that if you want to choose a Defined Type which you
            haven't defined yet you can choose '+ Create New Type' and it opens a
            quick little window (modal for those who care) which lets you define a
            Type using just the name you want it to have. You'll have to edit that
            Type later to give it any Super Types or Attributes it should have,
            but you can create it there so you can continue defining the Type
            you're already working on rather than having to leave and come back to
            it. The same thing can be done when creating or editing a Thing with
            an Attribute of type 'Type' or 'List' of 'Type', but for Things the
            Type has already been chosen. Now you will be creating a Thing of that
            Type. An example of this would be if you're editing the 'Character'
            'Harry Potter', but when you get to 'Best Friend' you realize you
            haven't added the 'Ron Weasley' 'Character' yet. You would choose '+
            Create New Character', and then in the quick little window you would
            type 'Ron Weasley'. He would get added as a blank character with just
            his Name, but he would then be selected as Harry's 'Best Friend', and
            you could finish defining Harry, and get to Ron later.
          </p>
          <p>
            And one more thing about Attributes in general.  I added the ability to
            set Default values for attributes on the Type.  Default Values will 
            automatically be set on any Things of that Type.  I made it as user 
            friendly as I could think to make it.
          </p>
          <p>
            (Planned Future Features: Other Attribute types, including: Image,
            Event, and External Link. If you have any suggestions of others, feel
            free to recommend them.  Also need to put in validation to detect 
            Name and Default collisions.)
          </p>
          <p>
            And that brings us to Things. If you've gotten to this point, then you
            probably already understand what Things are, but I'll outline it
            anyway. The generic term Thing is used to mean any actual thing you're
            keeping track of. This would be your Characters, your Places, your
            Items, Spells, whatever. When creating or editing a Thing you are able
            to choose Types for the Thing (works the same as Super Types for
            Types), and all the Attributes of those Types are added to the Thing,
            but now you're able to give values for them. Again remember to avoid
            Attribute Name collisions (If for some reason you've defined 2
            unrelated Types with an Attribute that has the same name but different
            Attribute types then you won't be able to have a Thing of both
            Types.). If a Type is edited to remove an Attribute, Things which use
            that Type and existed already will still have that Attribute. It will
            just be an orphaned Attribute. Currently there's no way to remove
            Attributes from Things. If a Type is edited to add Attributes then
            Things which already existed will gain those Attributes as soon as
            they're edited again. If a Type is edited and an Attribute is
            changed... I'm not actually sure what would happen to Things that
            already exist which have that Type. I'll have to test that. That's
            really it for Things. They're the simple part. (Planned Future
            Features: I'm planning to add the ability to add/remove/edit orphaned
            Attributes for Things. When I do, I'll probably try to find a way to
            make it so with adding/editing orphaned Attributes you'll be able to
            add the Attribute to a selected Type already on the Thing.)
          </p>
          <p>I probably should have put Attributes below Things, but oh well.</p>
          <p>Other Planned Future Features:</p>
          <div>
            <p>
              Direct Messages: I'll add a simple messaging system to allow people
              to communicate directly with one another.
            </p>
            <p>
              Auto-links: For both comments and DMs I'll allow users to put links to
              pages through a simple system similar to hashtags in Social Media.
              I'm thinking I also want to add this capability to Descriptions on
              Types and Things.
            </p>
            <p>
              Following Public Worlds: Currently all Public Worlds are listed in
              the menu, but I should make it so only those that the user follows
              are shown there, and have a button to pull up the full list, and add
              a button for people who neither own or collaborate on a Public World
              to 'Follow' the World.
            </p>
            <p>
              Home Page content: I'm planning to have actual Home Page content.
              This will have a link to a video tutorial for new users (which I
              have yet to make, and will need occasional updating after it's
              made), as well as things like recent software changes. I also want
              to make it so it can automatically have links to recently added or
              edited Types or Things and recent comments which may be of
              interest to the user.
            </p>
          </div> */}
        </div>
      );
    }
  }
}

const HomePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default HomePage;
